sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel"
], function (Controller, MessageBox, JSONModel) {
    "use strict";

    return Controller.extend("com.s4hana.salesorder.controller.SalesOrderVA01OWL", {
        onInit: function () {
            // Load top 20 sales orders via AJAX
            this._loadSalesOrders();
        },

        _loadSalesOrders: function () {
            var that = this;
            var oView = this.getView();
        
            // Set view busy before starting AJAX call
            oView.setBusy(true);
        
            $.ajax({
                url: "/sap/opu/odata4/sap/api_salesorder/srvd_a2x/sap/salesorder/0001/SalesOrder?$orderby=CreationDate desc,CreationTime desc&$top=20",
                method: "GET",
                headers: {
                    "Accept": "application/json"
                },
                success: function (oData) {
                    var aSalesOrders = oData.value || [];
                    console.log("Top 20 Sales Orders Loaded:", aSalesOrders);
        
                    var oJSONModel = new JSONModel(aSalesOrders);
                    oView.setModel(oJSONModel, "localSalesOrders");
                },
                error: function (xhr, status, error) {
                    console.error("Error loading Sales Orders:", xhr.responseText || error);
                    MessageBox.error("Error fetching Sales Orders: " + (xhr.responseText || error));
                },
                complete: function () {
                    // Always unset busy, even on error
                    oView.setBusy(false);
                }
            });
        },

        onPressNewSalesOrderButton: function () {
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("RouteSalesOrderVA01", { SalesOrderID: "New" });
            this._loadSalesOrders();
        }
    });
});
