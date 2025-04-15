/* global QUnit */
// https://api.qunitjs.com/config/autostart/
QUnit.config.autostart = false;

sap.ui.require([
	"coms4hana/salesorder/test/unit/AllTests"
], function (Controller) {
	"use strict";
	QUnit.start();
});