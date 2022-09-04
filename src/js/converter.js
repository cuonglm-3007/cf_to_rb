import cfmToErb from "./cfmToErb.js";
import cfmToRb from "./cfmToRb.js";
import cfquery from "./cfquery.js";

var mode = "erb";
var cfm = "";

function replaceLateCommon(text){
  // common
	text = text
          .replaceAll("		", "	")
          .replaceAll(/request.([\w]+)\.([\w]+)/g, "request[:$1][:$2]")
          .replaceAll(/request.([\w]+)/g, "request[:$1]")
          .replaceAll(" == 1", ".to_i == 1")
          .replaceAll(" == 0", '.to_s == "0"')
          .replaceAll(/structKeyExists\((.+)\) && |StructKeyExists\((.+)\) && /g, "")
          .replaceAll(/isDefined\((.+)\) && /g, "")
          .replaceAll(/ != ""|\.recordcount != 0/g, ".present?")
          .replaceAll(/ == ""|\.recordcount == 0/g, ".blank?")

  if (mode === "erb"){

  }

  if (mode === "rb"){
    text = text
          .replaceAll("&=", "+=")
          .replaceAll(/<cfset (.+)>/g, "$1")
          .replaceAll(/#([^#^ ^\n]+)#/g, "#{$1}")
  }
  
  if (mode === "cfquery"){
    
  }

  return text
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
