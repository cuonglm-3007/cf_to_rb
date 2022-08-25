import cfmToErb from "./cfmToErb.js";
import cfmToRb from "./cfmToRb.js";
import cfquery from "./cfquery.js";

var mode = "erb";
var cfm = "";

function replaceLateCommon(text){
	return text.replaceAll("		", "	");
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
