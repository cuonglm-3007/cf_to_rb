import cfmToErb from "./cfmToErb.js";
import cfmToRb from "./cfmToRb.js";
import cfquery from "./cfquery.js";

var mode = "erb";
var cfm = "";

// testText();
// function testText() {
//   const dataTest = `
//   `

//   document.getElementById("ta_cfm").value = dataTest;
//   cfm = dataTest;
//   mode = "rb"
//   updateErb();
// }

function replaceLateCommon(text) {
  // common
  let convertKeyCommon = [
    // \n\r
    {
      isRegex: true,
      cf: /#Chr\(13\)#|#chr\(13\)#/,
      rb: "\\r",
    },
    {
      isRegex: true,
      cf: /#Chr\(10\)#|#chr\(10\)#/,
      rb: "\\n",
    },
    // now
    {
      isRegex: true,
      cf: /now\(\)|Now\(\)|CreateODBCDateTime\(now\(\)\)|NOW\(\)/,
      rb: "Time.zone.now",
    },
    // dateadd
    {
      isRegex: true,
      cf: /(dateAdd|DateAdd|dateadd|Dateadd)\((| )('d'|"d")( |),( |)([1-9-]+),( |)([^\)]+)\)/,
      rb: "$8 + $6.days",
    },
    {
      isRegex: true,
      cf: /(dateAdd|DateAdd|dateadd|Dateadd)\((| )('h'|"h")( |),( |)([1-9-]+),( |)([^\)]+)\)/,
      rb: "$8 + $6.hours",
    },
    {
      isRegex: true,
      cf: /(dateAdd|DateAdd|dateadd|Dateadd)\((| )('n'|"n")( |),( |)([1-9-]+),( |)([^\)]+)\)/,
      rb: "$8 + $6.minutes",
    },
    {
      isRegex: true,
      cf: /(dateAdd|DateAdd|dateadd|Dateadd)\((| )('m'|"m")( |),( |)([1-9-]+),( |)([^\)]+)\)/,
      rb: "$8 + $6.months",
    },
    {
      isRegex: true,
      cf: /(DateFormat|dateFormat|dateformat|Dateformat|TimeFormat|timeformat|Timeformat|timeFormat)\(([^,\n ]+),([^,\n\)]+)\)/,
      rb: "$2&.strftime($3)",
    },
    // dateformat
    {
      isRegex: true,
      cf: /(DateFormat|dateFormat|dateformat|Dateformat|TimeFormat|timeformat|Timeformat|timeFormat)\(([^,\n]+),([^,\n\)]+)\)/,
      rb: "($2)&.strftime($3)",
    },
    // recordcount
    {
      isRegex: true,
      cf: /\.recordcount|\.RecordCount|\.recordCount|\.Recordcount/,
      rb: ".count",
    },
    // listappend
    {
      isRegex: true,
      cf: /(\S+) = (ListAppend|listappend|listAppend|Listappend)\(\1,(.+)\)/,
      rb: "$1 << $3",
    },
    // rereplace
    {
      isRegex: true,
      cf: /(ReReplace|rereplace|reREplage|REReplace)\(([^,"\)]+),( |)"([^,]+)",([^,\)]+)\)/,
      rb: "$2.sub(/$4/,$5)",
    },
    {
      isRegex: true,
      cf: /(ReReplace|rereplace|reREplage|REReplace)\(([^,"\)]+),( |)"([^,]+)",([^,\)]+),( |)("all"|"ALL")( |)\)/,
      rb: "$2.gsub(/$4/,$5)",
    },
    {
      isRegex: true,
      cf: /(ReReplace|rereplace|reREplage|REReplace)\(([^,"\)]+),( |)"([^,]+)",([^,\)]+),( |)("one"|"ONE")( |)\)/,
      rb: "$2.sub(/$4/,$5)",
    },
    // replace
    {
      isRegex: true,
      cf: /(Replace|replace|REplage)\(([^,"]+),([^,]+),([^,\)]+)\)/,
      rb: "$2.sub($3,$4)",
    },
    {
      isRegex: true,
      cf: /(Replace|replace|REplage)\(([^,"]+),([^,]+),([^,\)]+),( |)("all"|"ALL")( |)\)/,
      rb: "$2.gsub($3,$4)",
    },
    {
      isRegex: true,
      cf: /(Replace|replace|REplage)\(([^,"]+),([^,]+),([^,\)]+),( |)("one"|"ONE")( |)\)/,
      rb: "$2.sub($3,$4)",
    },
    // switch
    {
      isRegex: false,
      cf: "</cfswitch>",
      rb: "end",
    },
    {
      isRegex: true,
      cf: /<cfswitch expression="#([A-Za-z0-9_]+)#">/,
      rb: "case $1.to_s",
    },
    // case
    {
      isRegex: false,
      cf: "</cfcase>",
      rb: "",
    },
    {
      isRegex: true,
      cf: /<cfcase value="([A-Za-z0-9_]+)">/,
      rb: "when \"$1\"",
    },
    // {
    //   isRegex: true,
    //   cf: /regex/,
    //   rb: "chuyen regex thanh cong $1",
    // },
  ];

  // common
  text = text
    .replaceAll(/request.([\w]+)\.([\w]+)/g, "request[:$1][:$2]")
    .replaceAll(/request.([\w]+)/g, "request[:$1]")
    .replaceAll(
      /request\[:([\w]+)\]\[:([\w]+)\]( |)(==|eq|is)( |)1/g,
      "request[:$1][:$2].to_i == 1"
    )
    .replaceAll(
      /request\[:([\w]+)\]\[:([\w]+)\]( |)(==|eq|is)( |)0/g,
      'request[:$1][:$2].to_s == "0"'
    )
    .replaceAll(
      /request\[:([\w]+)\]( |)(==|eq|is)( |)1/g,
      "request[:$1].to_i == 1"
    )
    .replaceAll(
      /request\[:([\w]+)\]( |)(==|eq|is)( |)0/g,
      'request[:$1].to_s == "0"'
    )
    .replaceAll(/structKeyExists\((.+)\) && |StructKeyExists\((.+)\) && /g, "")
    .replaceAll(/(isDefined|IsDefined|isdefined|Isdefined)\((.+)\) && /g, "")
    .replaceAll(/ != ""|\.(recordcount|RecordCount|recordCount|Recordcount) != 0/g, ".present?")
    .replaceAll(/ == ""|\.(recordcount|RecordCount|recordCount|Recordcount) == 0/g, ".blank?");

  convertKeyCommon.forEach(function (element) {
    if (element.isRegex) {
      let cfRegex = new RegExp(element.cf, "g");
      text = text.replaceAll(cfRegex, element.rb);
    } else {
      text = text.replaceAll(element.cf, element.rb);
    }
  });

  if (mode === "erb") {
    text = text
      .replaceAll(/(XMLFormat|XMLformat|xmlFormat|xmlformat)\(([^\)]+)\)/g, "$2")
  }

  if (mode === "rb") {
    text = text
      .replaceAll("&=", "+=")
      .replaceAll(/<cfset (.+)>/g, "$1")
      .replaceAll(/#([^#^ ^\n]+)#/g, "#{$1}");
  }

  if (mode === "cfquery") {
  }

  return text;
}

window.handleChangeTaCfm = function handleChangeTaCfm() {
  cfm = document.getElementById("ta_cfm").value;
  updateErb();
};

window.handleChangeSelect = function handleChangeSelect(selectObject) {
  mode = selectObject.value;
  updateErb();
};

function convert_text(text) {
  if (mode === "erb") return replaceLateCommon(cfmToErb(text));
  if (mode === "rb") return replaceLateCommon(cfmToRb(text));
  if (mode === "cfquery") return replaceLateCommon(cfquery(text));
}

function updateErb() {
  let value = convert_text(cfm);
  document.getElementById("ta_erb").value = value;
  // document.getElementById("code_erb").value = value;
  // $('#code_erb').text(value);
  // $('#code_erb').removeClass( "prettyprinted" )
}
