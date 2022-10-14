import cfmToErb from "./cfmToErb.js";
import cfmToRb from "./cfmToRb.js";
import cfquery from "./cfquery.js";
import convertSimpleQuery from "./toSimpleQuery.js";
import { KEYS_AFTER } from "./constKeyAfter.js";
import { DATA_TEST } from "./constDataTest.js";

var mode = "rb";
var cfm = "";

const testMode = false;

if (testMode) {
  testText();
}

function testText() {
  document.getElementById("ta_cfm").value = DATA_TEST;
  cfm = DATA_TEST;
  mode = "rb";
  updateErb();
}

function replaceBeforeCommon(text) {
  text = convertSimpleQuery(text);
  return text;
}

function replaceLateCommon(text) {
  KEYS_AFTER.forEach(function (element) {
    if (element.isRegex) {
      let cfRegex = new RegExp(element.cf, "g");
      text = text.replaceAll(cfRegex, element.rb);
    } else {
      text = text.replaceAll(element.cf, element.rb);
    }
  });

  if (mode === "erb") {
    text = text.replaceAll(
      /(XMLFormat|XMLformat|xmlFormat|xmlformat)\(([^\)]+)\)/g,
      "$2"
    );
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

window.handleChangeSelect = function handleChangeSelect(value) {
  $(".nav-link").removeClass("active");
  $(`#button-${value}`).addClass("active");
  mode = value;
  updateErb();
};

function convert_text(text) {
  // before
  text = replaceBeforeCommon(text);

  switch (mode) {
    case "erb":
      text = cfmToErb(text);
      break;
    case "rb":
      text = cfmToRb(text);
      break;
    case "cfquery":
      text = cfquery(text);
      break;
  }

  // after
  text = replaceLateCommon(text);

  return text;
}

function updateErb() {
  let value = convert_text(cfm);
  document.getElementById("ta_erb").value = value;
}
