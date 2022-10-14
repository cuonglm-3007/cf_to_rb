export const KEYS_AFTER = [
  // rquest
  {
    isRegex: true,
    cf: /request\.([\w]+)\.([\w]+)/,
    rb: "request[:$1][:$2]",
  },
  {
    isRegex: true,
    cf: /request\.([\w]+)/,
    rb: "request[:$1]",
  },
  {
    isRegex: true,
    cf: /request\[:([\w]+)\]\[:([\w]+)\]( |)(==|eq|is)( |)1/,
    rb: "request[:$1][:$2].to_i == 1",
  },
  {
    isRegex: true,
    cf: /request\[:([\w]+)\]\[:([\w]+)\]( |)(==|eq|is)( |)0/,
    rb: 'request[:$1][:$2].to_s == "0"',
  },
  {
    isRegex: true,
    cf: /request\[:([\w]+)\]( |)(==|eq|is)( |)1/,
    rb: "request[:$1].to_i == 1",
  },
  {
    isRegex: true,
    cf: /request\[:([\w]+)\]( |)(==|eq|is)( |)0/,
    rb: 'request[:$1].to_s == "0"',
  },
  // structKeyExists
  {
    isRegex: true,
    cf: /structKeyExists\((.+)\) && |StructKeyExists\((.+)\) && /,
    rb: "",
  },
  // isDefined
  {
    isRegex: true,
    cf: /(isDefined|IsDefined|isdefined|Isdefined)\((.+)\) && /,
    rb: "",
  },
  {
    isRegex: true,
    cf: / != ""|\.(recordcount|RecordCount|recordCount|Recordcount) != 0/,
    rb: ".present?",
  },
  {
    isRegex: true,
    cf: / == ""|\.(recordcount|RecordCount|recordCount|Recordcount) == 0/,
    rb: ".blank?",
  },
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
    cf: /(dateAdd|DateAdd|dateadd|Dateadd)\((| )('d'|"d")( |),( |)([^,]+),( |)([^\)]+)\)/,
    rb: "$8 + $6.to_i.days",
  },
  {
    isRegex: true,
    cf: /(dateAdd|DateAdd|dateadd|Dateadd)\((| )('h'|"h")( |),( |)([^,]+),( |)([^\)]+)\)/,
    rb: "$8 + $6.to_i.hours",
  },
  {
    isRegex: true,
    cf: /(dateAdd|DateAdd|dateadd|Dateadd)\((| )('n'|"n")( |),( |)([^,]+),( |)([^\)]+)\)/,
    rb: "$8 + $6.to_i.minutes",
  },
  {
    isRegex: true,
    cf: /(dateAdd|DateAdd|dateadd|Dateadd)\((| )('m'|"m")( |),( |)([^,]+),( |)([^\)]+)\)/,
    rb: "$8 + $6.to_i.months",
  },
  // dateformat
  {
    isRegex: true,
    cf: /(DateFormat|dateFormat|dateformat|Dateformat|TimeFormat|timeformat|Timeformat|timeFormat)\(([^,\n ]+),([^,\n\)]+)\)/,
    rb: "$2&.strftime($3)",
  },
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
    rb: 'when "$1"',
  },
  // len, listlen, arraylen
  {
    isRegex: true,
    cf: /(ListLen|listLen|listlen|Listlen)\((( |)([^,]+)( |))\, (( |)([^\\)]+)( |))\)/,
    rb: "$2.split($6).length",
  },
  {
    isRegex: true,
    cf: /(ArrayLen|arrayLen|arraylen|Arraylen|ListLen|listLen|listlen|Listlen)\(( |)([^\(\)]+)( |)\)/,
    rb: "$3.length",
  },
  {
    isRegex: true,
    cf: /(len|Len)\(( |)([^\(\)]+)( |)\)/,
    rb: "$3.length",
  },
  // ReFind
  {
    isRegex: true,
    cf: /(ReFind|refind|Refind|reFind|REFind|REfind|rEFind)\(( |)"(.+)"( |),( |)(.+)( |)\) (eq|==) 0/,
    rb: "!$6.match?(/$3/) ",
  },
  {
    isRegex: true,
    cf: /(ReFind|refind|Refind|reFind|REFind|REfind|rEFind)\(( |)"(.+)"( |),( |)(.+)( |)\) (eq|==) 0/,
    rb: "!$6.match?(/$3/) ",
  },
  {
    isRegex: true,
    cf: /(ReFind|refind|Refind|reFind|REFind|REfind|rEFind)\(( |)'(.+)'( |),( |)(.+)( |)\) (gt|>) 0/,
    rb: "$6.match?(/$3/) ",
  },
  {
    isRegex: true,
    cf: /(ReFind|refind|Refind|reFind|REFind|REfind|rEFind)\(( |)'(.+)'( |),( |)(.+)( |)\) (gt|>) 0/,
    rb: "$6.match?(/$3/) ",
  },
  // ListFind
  {
    isRegex: true,
    cf: /(ListFind|listFind|Listfind|listfind)/,
    rb: "list_find",
  },
  // ListFindNOCase
  {
    isRegex: true,
    cf: /(ListFindNoCase|listFindNoCase|listfindnocase|listfindNoCase|listfindnoCase|listfindnoCase)/,
    rb: "list_find_no_case",
  },
  // ListGetAt
  {
    isRegex: true,
    cf: /(listGetAt|listgetat|ListgetAt|listgetAt)/,
    rb: "list_get_at",
  },
  // Find
  {
    isRegex: true,
    cf: / (Find|find)\(( |)'(.+)'( |),( |)(.+)( |)\) (eq|==) 0/,
    rb: ' !$6.match?("$3") ',
  },
  {
    isRegex: true,
    cf: / (Find|find)\(( |)'(.+)'( |),( |)(.+)( |)\) (gt|>) 0/,
    rb: ' $6.match?("$3") ',
  },
  {
    isRegex: true,
    cf: / (Find|find)\(( |)"(.+)"( |),( |)(.+)( |)\) (eq|==) 0/,
    rb: ' !$6.match?("$3") ',
  },
  {
    isRegex: true,
    cf: / (Find|find)\(( |)"(.+)"( |),( |)(.+)( |)\) (gt|>) 0/,
    rb: ' $6.match?("$3") ',
  },
  // isNumeric
  {
    isRegex: true,
    cf: /(isNumeric|IsNumeric|isnumeric|ISNumeric)/,
    rb: "is_numeric?",
  },
  // <cfcontinue>
  {
    isRegex: false,
    cf: "<cfcontinue>",
    rb: "next",
  },
  // <cfbreak>
  {
    isRegex: false,
    cf: "<cfbreak>",
    rb: "break",
  },
  // Format date
  {
    isRegex: true,
    cf: /("yyyy\/mm\/dd"|"YYYY\/MM\/DD"|'yyyy\/mm\/dd'|'YYYY\/MM\/DD')/,
    rb: "Settings.datetime.year_month_date",
  },
  {
    isRegex: true,
    cf: /("yyyymmdd"|"YYYYMMDD"|'yyyymmdd'|'YYYYMMDD')/,
    rb: "Settings.datetime.csv_date",
  },
  // <cftransaction>
  {
    isRegex: false,
    cf: "<cftransaction>",
    rb: "ApplicationRecord.transaction do",
  },
  {
    isRegex: false,
    cf: "</cftransaction>",
    rb: "end",
  },
  // {
  //   isRegex: true,
  //   cf: /regex/,
  //   rb: "chuyen regex thanh cong $1",
  // },
];
