export default convertSimpleQuery;

var params = [];
var indexParams = 0;

function convertSimpleQuery(text) {
  text = text.replaceAll(
    /(<cfquery|<CFQUERY)([^\>]+)>((\n|.)+?)(<\/cfquery>|<\/CFQUERY>)/g,
    (matchText) => {
      resetParams();
      let matchLowerCase = matchText.toLowerCase();

      let countJoin = (matchLowerCase.match(/join/g) || []).length;
      if (countJoin > 0) return matchText;

      let countInsertInto = (matchLowerCase.match(/insert into/g) || []).length;
      let countUpdate = (matchLowerCase.match(/update/g) || []).length;
      let countSelect = (matchLowerCase.match(/select/g) || []).length;

      if (countInsertInto + countUpdate + countSelect > 1) return matchText;

      if (countInsertInto == 1) {
        return convertSimpleInsert(matchText);
      }

      if (countUpdate == 1) {
        return convertSimpleUpdate(matchText);
      }

      if (countSelect == 1) {
        // return if cntCount > 0
        return convertSimpleSelect(matchText);
      }

      return matchText;
    }
  );

  return text;
}

function convertSimpleInsert(text) {
  text = replaceParamsQuery(text);

  text = convertInsert(text);

  text = replaceQueryParams(text);
  return text;
}

function convertInsert(text) {
  text = text.replaceAll(
    /(<cfquery|<CFQUERY)([^\>]+)>((\n|.)+?)(<\/cfquery>|<\/CFQUERY>)/g,
    (matchText, p1, p2, p3, p4, p5) => {
      let insertQuery = p3.replaceAll("\n", "");
      let nameQuery = "";
      let nameParamsQuery = [];
      let valueParamsQuery = [];
      let isConvertSuccess = false;

      insertQuery.replaceAll(
        /(insert into|INSERT INTO)( |)(.+?)\((.+?)\)(.+?)\((.+?)\)/g,
        (match, i1, i2, i3, i4, i5, i6) => {
          nameQuery = i3;
          nameParamsQuery = i4.split(",");
          valueParamsQuery = i6.split(",");
        }
      );

      if (
        nameQuery != "" &&
        nameParamsQuery.length == valueParamsQuery.length
      ) {
        let result = "";
        result += `${convertNameQuery(nameQuery.trim())}.create(\n`;

        for (let index = 0; index < nameParamsQuery.length; index++) {
          result += `\t${nameParamsQuery[index].trim()}: ${valueParamsQuery[
            index
          ].trim()},\n`;
        }

        result += `)`;

        isConvertSuccess = true;
        return result;
      } else {
        isConvertSuccess = false;
        return matchText;
      }
    }
  );

  return text;
}

function convertSimpleUpdate(text) {
  return text;
}

function convertSimpleSelect(text) {
  return text;
}

function replaceParamsQuery(text) {
  return text
    .replaceAll(/<cfqueryparam.*?value="#([\w.]+?)#".*?>/g, (match, p1) => {
      return getMarkKey(p1);
    })
    .replaceAll(
      /<cfqueryparam cfsqltype="CF_SQL_TIMESTAMP" value="(#Now\(\)#|#now\(\)#|#(CreateODBCDateTime\(now\(\)\)|CreateODBCDateTime\(Now\(\)\)|createODBCDateTime\(now\(\)\)|CreateODBCDateTime\(now\(\)\))#)"( |)>/g,
      (match) => {
        return getMarkKey("time_type");
      }
    )
    .replaceAll(/<cfqueryparam(.*?)>/g, (match, p1) => {
      let type = p1.match(/cfsqltype="(.*?)"/);
      let value = p1.match(/value="(.*?)"/);

      if (!type || !value) {
        return getMarkKey(match);
      }

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

function replaceQueryParams(text) {
  for (let index = 0; index < params.length; index++) {
    let result = "";
    if (params[index] == "time_type") {
      result = "Time.zone.now";
    } else {
      result = params[index];
    }

    text = text.replaceAll(`%%%${index}%%%`, result);
  }

  return text;
}

function getMarkKey(textParams) {
  let result = `%%%${indexParams}%%%`;
  addParam(textParams);
  return result;
}

function addParam(textParams) {
  params.push(textParams);
  indexParams++;
}

function resetParams() {
  params = [];
  indexParams = 0;
}

function convertNameQuery(nameQuery) {
  nameQuery = nameQuery.trim();
  let listKeys = nameQuery.split("_");

  let result = "";

  for (let index = 0; index < listKeys.length; index++) {
    if (listKeys[index] != "") {
      result += capitalizeFirstLetter(listKeys[index]);
    }
  }

  return result;
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
