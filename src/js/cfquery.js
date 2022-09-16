export default function cfquery(text) {
  return flow([pre, parse, convert, remove_comment])(text);
}

var params = [];
var indexParams = 0;
var uniqueParams = new Set();

const SINGLE_TAGS = [
  "cfset",
  "cfcontinue",
  "cfelse",
  "cfelseif",
  "cfqueryparam",
  "cfparam",
  "cfbreak",
];

function flow(cbs) {
  return (text) => cbs.reduce((_, cb) => cb(_), text);
}

function pre(text) {
  return text
    .replaceAll(/<cfqueryparam.*?value="#([\w.]+?)#".*?>/g, (match, p1) => {
      params.push(p1);
      return "%%?%%";
    })
    .replaceAll(
      /<cfqueryparam cfsqltype="CF_SQL_TIMESTAMP" value="(#Now\(\)#|#now\(\)#|CreateODBCDateTime\(now\(\)\)|CreateODBCDateTime\(Now\(\)\)|createODBCDateTime\(now\(\)\))">/g,
      (match) => {
        params.push("Time.zone.now");
        return "%%?%%";
      }
    )
    .replaceAll(/<cfqueryparam(.*?)>/g, (match, p1) => {
      let type = p1.match(/cfsqltype="(.*?)"/);
      let value = p1.match(/value="(.*?)"/);

      if (!type || !value) return match;

      switch (type[1]) {
        case "CF_SQL_VARCHAR":
          return value[1];
        case "CF_SQL_INTEGER":
          return value[1];
        default:
          return value[1];
      }
    });
}

function parse(text) {
  const data = text.split(/(<cf[\s\S]+?>|<\/cf.*?>)/);
  let root = new MyNode("root");

  var parent = root;
  data.forEach((t, index) => {
    if (t.match(/<cf[\s\S]+?>/)) {
      let match = t.match(/<(cf[a-z]+)[\s\S]*?>/);
      if (match) {
        const tag = new MyNode(match[1], match[0]);
        parent.add(tag);
        if (SINGLE_TAGS.includes(tag.name)) return;

        parent = tag;
      }
    } else if (t.match(/<\/cf.*?>/)) {
      let match = t.match(/<\/(cf.*?)>/);
      if (match && match[1] === parent.name) parent = parent.parent;
    } else {
      parent.add(new MyNode("text", t));
    }
  });

  return root;
}

function convert(node) {
  switch (node.name) {
    case "root":
      return convert_root(node);
    case "cfif":
      return convert_cfif(node);
    case "text":
      return convert_text(node);
    case "cfelse":
      return "else\n";
    case "cfelseif":
      return convert_cfelseif(node);
    case "cfset":
      return convert_cfset(node);
    case "cfquery":
      return convert_cfquery(node);
    default:
      return convert_default(node);
  }
}

function addUniqueParam(variable) {
  uniqueParams.add(variable.split(".")[0]);
}

function convert_text(node, isFirst = false) {
  if (!isFirst && node.content.trim() === "") return "";

  let content = node.content.trim();
  let times = 0;

  content = content.replaceAll(/%%\?%%/g, (match, p1) => {
    times++;
    return "?";
  });

  let result = "";
  if (!isFirst) {
    result += `\tsql[0] += "${content} "\n`;
  } else {
    result += `\t sql = ["${content} "]\n`;
  }

  if (times > 0) {
    result += `sql << ${params
      .slice(indexParams, indexParams + times)
      .join(" << ")}\n`;

    for (let i = indexParams; i < indexParams + times; i++) {
      addUniqueParam(params[i]);
    }

    indexParams += times;
  }

  return result;
}

function convert_cfif(node) {
  let tmp = node.content.replace(/<cfif ([\s\S]*?)>/, (match, p1) => {
    return `if ${expression_in_tag(p1)}\n`;
  });

  node.children.forEach(function (childNode) {
    if (childNode.name === "text") {
      tmp += convert_text(childNode);
    } else {
      tmp += convert(childNode);
    }
  });

  if (tmp.slice(-1) != "\n") {
    tmp += "\n";
  }
  tmp += "end\n";
  return tmp;
}

function expression_in_tag(text) {
  return text
    .trim()
    .replaceAll(/is equal/gi, "==")
    .replaceAll(/ eq /gi, " == ")
    .replaceAll(/ is not /gi, " != ")
    .replaceAll(/not equal/gi, "!=")
    .replaceAll(/ neq /gi, " != ")
    .replaceAll(/greater than/gi, ">")
    .replaceAll(/ gt /gi, " > ")
    .replaceAll(/less than/gi, "<")
    .replaceAll(/ lt /gi, " < ")
    .replaceAll(/greater than or equal to/gi, ">=")
    .replaceAll(/ gte /gi, " >= ")
    .replaceAll(/ ge /gi, " >= ")
    .replaceAll(/less than or equal to/gi, "<=")
    .replaceAll(/ lte /gi, " <= ")
    .replaceAll(/ le /gi, " <= ")
    .replaceAll(/ is /gi, " == ")
    .replaceAll(/ and /gi, " && ")
    .replaceAll(/ or /gi, " || ")
    .replaceAll(
      /chkPermission\("([\w"]+)"\) (is|==) 1/g,
      'chk_permission?("$1")'
    )
    .replaceAll(/ == ""/g, ".blank?");
}

function MyNode(name, content = "") {
  this.name = name;
  this.content = content;
  this.children = [];

  this.add = function (node) {
    this.children.push(node);
    node.parent = this;
  };

  this.first = function (node) {
    return this.children[0];
  };
}

function convert_root(node) {
  let tmp = "";
  node.children.forEach((childNode) => {
    tmp += convert(childNode);
  });

  return tmp;
}

function convert_default(node) {
  let tmp = node.content;
  if (SINGLE_TAGS.includes(node.name)) return tmp;

  tmp += convert_root(node);
  tmp += `</${node.name}>`;

  return tmp;
}

function convert_cfelseif(node) {
  return node.content.replace(/<cfelseif ([\s\S]*?)>/, (match, p1) => {
    return `elsif ${expression_in_tag(p1)}\n`;
  });
}

function convert_cfset(node) {
  if (node.content.match(/<cfset error_msg = ListAppend\(error_msg, (.*?)\)>/))
    return node.content.replace(
      /<cfset error_msg = ListAppend\(error_msg, (.*?)\)>/,
      "@error_msg << $1"
    );

  return node.content.replaceAll(
    /<cfset ([\w.]+?) = ([\s\S]*?)>/g,
    (match, p1, p2) => {
      return `${p1} = ${expression_in_tag(p2)}`;
    }
  );
}

function convert_cfquery(node) {
  let body = "";

  node.children.forEach((childNode, index) => {
    if (childNode.name === "text" && index === 0) {
      body += convert_text(childNode, true);
      return;
    }
    body += "\t" + convert(childNode);
  });

  let match = node.content.match(/name="(\w+)"/);
  if (!match) return node.content;

  let tmp = "";
  let args = Array.from(uniqueParams);
  tmp += `def ${match[1]} ${args.join(", ")}\n`;

  tmp += body;

  tmp += `\n\n\tfind_by_sql sql`;
  tmp += "\nend";

  return tmp;
}

function remove_comment(text) {
  return text.replaceAll(/<!---[\s\S]*?--->/g, "");
}
