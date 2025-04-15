/*global QUnit*/

sap.ui.define([
	"coms4hana/salesorder/controller/SalesOrderVA01.controller"
], function (Controller) {
	"use strict";

	QUnit.module("SalesOrderVA01 Controller");

	QUnit.test("I should test the SalesOrderVA01 controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
