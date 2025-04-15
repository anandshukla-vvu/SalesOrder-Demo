sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/BusyIndicator",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], (Controller, MessageBox, JSONModel, BusyIndicator, Filter, FilterOperator) => {
    "use strict";

    return Controller.extend("com.s4hana.salesorder.controller.SalesOrderVA01", {
        onInit() {
            this.getOwnerComponent().getRouter().getRoute("RouteSalesOrderVA01").attachPatternMatched(this._refreshView, this);

            // Load Sales Organization Value Help from OData
            const oSalesOrgODataModel = this.getOwnerComponent().getModel("salesOrgVHModel");
            oSalesOrgODataModel.read("/A_SalesOrganizationText", {
                success: (oData) => {
                    const aSalesOrgList = oData.results.map(item => ({
                        key: item.SalesOrganization,
                        text: item.SalesOrganizationName
                    }));
                    const oVHModel = new JSONModel(aSalesOrgList);
                    this.getView().setModel(oVHModel, "salesOrgVHModel");
                },
                error: (err) => {
                    console.error("Failed to load Sales Organizations:", err);
                    MessageBox.error("Unable to fetch Sales Organizations.");
                }
            });
              // Load Divison code Value Help from OData
            const oDivisionODataModel = this.getOwnerComponent().getModel("divisionVHModel");
            oDivisionODataModel.read("/A_DivisionText", {
                success: (oData) => {
                    const aDivisionList = oData.results.map(item => ({
                        key: item.Division,
                        text: item.DivisionName
                    }));
                    const oVHModel = new JSONModel(aDivisionList);
                    this.getView().setModel(oVHModel, "divisionVHModel");
                },
                error: (err) => {
                    console.error("Failed to load Division:", err);
                    MessageBox.error("Unable to fetch Division.");
                }
            });
             // Load Customer code Value Help from OData
             const oCustomerODataModel = this.getOwnerComponent().getModel("customerVHModel");
             oCustomerODataModel.read("/A_Customer", {
                 success: (oData) => {
                     const aDivisionList = oData.results.map(item => ({
                         key: item.Customer,
                         text: item.CustomerName
                     }));
                     const oVHModel = new JSONModel(aDivisionList);
                     this.getView().setModel(oVHModel, "customerVHModel");
                 },
                 error: (err) => {
                     console.error("Failed to load Division:", err);
                     MessageBox.error("Unable to fetch Division.");
                 }
             });
             // Load Distribution Channel Value Help from OData
             const oDistODataModel = this.getOwnerComponent().getModel("distributionchannelVHModel");
             oDistODataModel.read("/A_DistributionChannelText", {
                 success: (oData) => {
                     const aDistList = oData.results.map(item => ({
                         key: item.DistributionChannel,
                         text: item.DistributionChannelName
                     }));
                     const oVHModel = new JSONModel(aDistList);
                     this.getView().setModel(oVHModel, "distributionchannelVHModel");
                 },
                 error: (err) => {
                     console.error("Failed to load Distribution Channel :", err);
                     MessageBox.error("Unable to fetch Distribution Channel.");
                 }
             });
        },

        _refreshView() {
            this.getView().setModel(new JSONModel({ Item: [] }), "salesOrderModel");

            const oView = this.getView();
            const aInputIds = [
                "_IDGenInput", "_IDGenInput1", "_IDGenInput2", "_IDGenInput3",
                "_IDGenInput4", "_IDGenInput5", "_IDGenInput16", "_IDGenInput9",
                "_IDGenInput10", "_IDGenInput11", "_IDGenInput12", "_IDGenInput13",
                "_IDGenInput14",
            ];

            aInputIds.forEach(id => {
                let oInput = oView.byId(id);
                if (oInput) oInput.setValue("");
            });

            let oTable = oView.byId("itemTable");
            if (oTable) oTable.removeSelections();
        },
        onDistributionChannelValueHelp: function (oEvent) {
            const oInput = oEvent.getSource();
        
            if (!this._distributionChannelVHDialog) {
                this._distributionChannelVHDialog = new sap.m.SelectDialog({
                    title: "Select Distribution Channel",
                    items: {
                        path: "distributionchannelVHModel>/",
                        template: new sap.m.StandardListItem({
                            title: "{distributionchannelVHModel>text}",
                            description: "{distributionchannelVHModel>key}"
                        })
                    },
                    search: function (oEvt) {
                        const sValue = oEvt.getParameter("value");
                        const oFilter = new Filter("text", FilterOperator.Contains, sValue);
                        oEvt.getSource().getBinding("items").filter([oFilter]);
                    },
                    confirm: function (oEvt) {
                        const oSelected = oEvt.getParameter("selectedItem");
                        if (oSelected) {
                            const sKey = oSelected.getDescription();
                            const sText = oSelected.getTitle();
                            oInput.setValue(sText);
                            // Optional: store value in salesOrderModel
                            oInput.getBinding("value")?.getModel()?.setProperty("/DistributionChannel", sKey);
                        }
                    },
                    cancel: function () {}
                });
                this.getView().addDependent(this._distributionChannelVHDialog);
            }
        
            this._distributionChannelVHDialog.open();
        },
        
        onDivisionValueHelp: function (oEvent) {
            const oInput = oEvent.getSource();
        
            if (!this._divisionVHDialog) {
                this._divisionVHDialog = new sap.m.SelectDialog({
                    title: "Select Division",
                    items: {
                        path: "divisionVHModel>/",
                        template: new sap.m.StandardListItem({
                            title: "{divisionVHModel>text}",
                            description: "{divisionVHModel>key}"
                        })
                    },
                    search: function (oEvt) {
                        const sValue = oEvt.getParameter("value");
                        const oFilter = new Filter("text", FilterOperator.Contains, sValue);
                        oEvt.getSource().getBinding("items").filter([oFilter]);
                    },
                    confirm: function (oEvt) {
                        const oSelected = oEvt.getParameter("selectedItem");
                        if (oSelected) {
                            const sKey = oSelected.getDescription();
                            const sText = oSelected.getTitle();
                            oInput.setValue(sText);
                            oInput.getBinding("value")?.getModel()?.setProperty("/OrganizationDivision", sKey);
                        }
                    },
                    cancel: function () {}
                });
                this.getView().addDependent(this._divisionVHDialog);
            }
        
            this._divisionVHDialog.open();
        },
        onCustomerValueHelp: function (oEvent) {
            const oInput = oEvent.getSource();
        
            if (!this._customerVHDialog) {
                this._customerVHDialog = new sap.m.SelectDialog({
                    title: "Select Customer",
                    items: {
                        path: "customerVHModel>/",
                        template: new sap.m.StandardListItem({
                            title: "{customerVHModel>text}",
                            description: "{customerVHModel>key}"
                        })
                    },
                    search: function (oEvt) {
                        const sValue = oEvt.getParameter("value");
                        const oFilter = new Filter("key", FilterOperator.Contains, sValue);
                        oEvt.getSource().getBinding("items").filter([oFilter]);
                    },
                    confirm: function (oEvt) {
                        const oSelected = oEvt.getParameter("selectedItem");
                        if (oSelected) {
                            const sKey = oSelected.getDescription();
                            const sText = oSelected.getTitle();
                            oInput.setValue(sText);
                            oInput.getBinding("value")?.getModel()?.setProperty("/Customer", sKey);
                        }
                    },
                    cancel: function () {}
                });
                this.getView().addDependent(this._customerVHDialog);
            }
        
            this._customerVHDialog.open();
        },        

        onSalesOrgValueHelp: function (oEvent) {
            const oInput = oEvent.getSource();

            if (!this._salesOrgVHDialog) {
                this._salesOrgVHDialog = new sap.m.SelectDialog({
                    title: "Select Sales Organization",
                    items: {
                        path: "salesOrgVHModel>/",
                        template: new sap.m.StandardListItem({
                            title: "{salesOrgVHModel>text}",
                            description: "{salesOrgVHModel>key}"
                        })
                    },
                    search: function (oEvt) {
                        const sValue = oEvt.getParameter("value");
                        const oFilter = new Filter("text", FilterOperator.Contains, sValue);
                        oEvt.getSource().getBinding("items").filter([oFilter]);
                    },
                    confirm: function (oEvt) {
                        const oSelected = oEvt.getParameter("selectedItem");
                        if (oSelected) {
                            const sKey = oSelected.getDescription();
                            const sText = oSelected.getTitle();
                            oInput.setValue(sText);
                            oInput.getBinding("value")?.getModel()?.setProperty("/SalesOrganization", sKey);
                        }
                    },
                    cancel: function () {}
                });
                this.getView().addDependent(this._salesOrgVHDialog);
            }

            this._salesOrgVHDialog.open();
        },

        onBeforeRendering() {
            this._refreshView();
        },

        onAddRow() {
            let oModel = this.getView().getModel("salesOrderModel");
            let aItems = oModel.getProperty("/Item") || [];

            aItems.push({
                "Product": "",
                "RequestedQuantity": "",
                "RequestedQuantityISOUnit": "",
                "TransactionCurrency": "",
                "_ItemPricingElement": []
            });

            oModel.setProperty("/Item", aItems);
            oModel.refresh(true);
        },

        onRemoveRow() {
            let oTable = this.getView().byId("itemTable");
            let oModel = this.getView().getModel("salesOrderModel");
            let aItems = oModel.getProperty("/Item") || [];
            let aSelectedItems = oTable.getSelectedItems();

            if (!aSelectedItems.length) {
                MessageBox.warning("Please select a row to remove.");
                return;
            }

            aSelectedItems.forEach(oItem => {
                let iIndex = oTable.indexOfItem(oItem);
                if (iIndex !== -1) {
                    aItems.splice(iIndex, 1);
                }
            });

            oModel.setProperty("/Item", aItems);
            oModel.refresh(true);
            oTable.removeSelections();
        },

        async onSave(bCloseAfterSave) {
            const oView = this.getView();
            const oModel = oView.getModel("salesOrderModel");
            let aItems = oModel.getProperty("/Item") || [];

            const sSalesOrderType = oView.byId("_IDGenInput").getValue().trim();
            const sSoldToParty = oView.byId("customerInput").getValue().trim();
            if (!sSalesOrderType || !sSoldToParty) {
                MessageBox.error("Sales Order Type and Sold To Party are required.");
                return;
            }

            const oPayload = {
                "SalesOrderType": sSalesOrderType,
                "SoldToParty": sSoldToParty,
                "SalesOrganization": oView.byId("salesOrgInput").getValue().trim(),
                "DistributionChannel": oView.byId("distributionInput").getValue().trim(),
                "OrganizationDivision": oView.byId("divisionInput").getValue().trim(),
                "PurchaseOrderByCustomer": oView.byId("_IDGenInput5").getValue().trim(),
                "TransactionCurrency": oView.byId("_IDGenInput16").getValue().trim(),
                "_Item": aItems.map(item => {
                    let cleanedItem = { ...item };
                    delete cleanedItem.ConditionRateAmount;

                    return {
                        ...cleanedItem,
                        "RequestedQuantity": parseInt(item.RequestedQuantity, 10) || 0,
                        "_ItemPricingElement": [{
                            "ConditionType": "PPR0",
                            "ConditionCalculationType": "C",
                            "ConditionRateAmount": parseInt(item.ConditionRateAmount, 10) || 0,
                            "ConditionCurrency": item.TransactionCurrency,
                            "ConditionQuantity": 1,
                            "ConditionQuantitySAPUnit": "ST",
                            "ConditionQuantityISOUnit": item.RequestedQuantityISOUnit,
                            "ConditionAmount": item.ConditionRateAmount && item.RequestedQuantity
                                ? (parseInt(item.ConditionRateAmount, 10) * parseInt(item.RequestedQuantity, 10)) : 0,
                            "TransactionCurrency": item.TransactionCurrency
                        }],
                        "_VariantConfiguration": {
                            "_Instance": [{
                                "VarConfignInstceInternalID": 1,
                                "VarConfignParInstceInternalID": 1,
                                "_Characteristic": this._getVariantConfigData()
                            }]
                        }
                    };
                })
            };

            console.log("Payload:", JSON.stringify(oPayload, null, 2));

            try {
                BusyIndicator.show(0);
                const sCsrfToken = await this._fetchCSRFToken();
                await this._createSalesOrder(oPayload, sCsrfToken);
                // Extract Sales Order ID from response (adjust based on actual structure)
                //const sSalesOrderId = response.SalesOrder || "unknown";

                MessageBox.success(`Sales Order created successfully!`, {
                    onClose: () => {
                        if (bCloseAfterSave) {
                            this.getOwnerComponent().getRouter().navTo("RouteSalesOrderVA01OWL");
                        }
                    }
                });
            } catch (error) {
                let sErrorMsg = "Failed to create Sales Order.";
            
                let oError = error?.responseJSON?.error;
                if (!oError && error?.responseText) {
                    try {
                        const parsed = JSON.parse(error.responseText);
                        oError = parsed.error;
                    } catch (e) {
                        // fallback
                    }
                }
            
                if (oError?.code && oError?.message) {
                    sErrorMsg += `\n[${oError.code}] ${oError.message}`;
                }
            
                MessageBox.error(sErrorMsg);
                console.error("Error Response:", error);
            } finally {
                BusyIndicator.hide();
            }
        },

        onClose() {
            this.getOwnerComponent().getRouter().navTo("RouteSalesOrderVA01OWL");
        },

        onSaveAndClose() {
            this.onSave(true);
        },

        _fetchCSRFToken() {
            return new Promise((resolve, reject) => {
                $.ajax({
                    url: this.getView().getModel().sServiceUrl,
                    type: "HEAD",
                    headers: { "x-csrf-token": "fetch" },
                    xhrFields: {
                        withCredentials: true
                    },
                    success: function (data, status, xhr) {
                        const sCsrfToken = xhr.getResponseHeader("X-CSRF-Token");
                        sCsrfToken ? resolve(sCsrfToken) : reject("CSRF token not received");
                    },
                    error: function (error) {
                        reject(error);
                    }
                });
            });
        },

        _createSalesOrder(oPayload, sCsrfToken) {
            return new Promise((resolve, reject) => {
                $.ajax({
                    url: this.getView().getModel().sServiceUrl + "SalesOrder",
                    type: "POST",
                    contentType: "application/json",
                    dataType: "json",
                    data: JSON.stringify(oPayload),
                    headers: { "x-csrf-token": sCsrfToken },
                    xhrFields: {
                        withCredentials: true
                    },
                    success: function (response) {
                        resolve(response);
                        //const sSalesOrderId = response.SalesOrder || "unknown";
                    },
                    error: function (error) {
                        reject(error);
                    }
                });
            });
        },

        _getVariantConfigData() {
            const oView = this.getView();
            return [
                { "Characteristic": "ZD_THCKNS", "_AssignedValue": [{ "VarCnfCharcFromQuantity": parseFloat(oView.byId("_IDGenInput9").getValue()), "VarCnfCharcFromQuantityISOUnit": "INH" }] },
                { "Characteristic": "ZD_NOD", "_AssignedValue": [{ "VarCnfCharcFromQuantity": parseInt(oView.byId("_IDGenInput10").getValue(), 10), "VarCnfCharcFromQuantityISOUnit": "INH" }] },
                { "Characteristic": "Z_STLTYP", "_AssignedValue": [{ "VarCnfCharacteristicValue": oView.byId("_IDGenInput11").getValue() }] },
                { "Characteristic": "Z_CUSTTAG", "_AssignedValue": [{ "VarCnfCharacteristicValue": oView.byId("_IDGenInput12").getValue() }] },
                { "Characteristic": "Z_MCRHRDNSS", "_AssignedValue": [{ "VarCnfCharacteristicValue": oView.byId("_IDGenInput13").getValue() }] },
                { "Characteristic": "ZMP_CHARPY_DIRCTN", "_AssignedValue": [{ "VarCnfCharacteristicValue": oView.byId("_IDGenInput14").getValue() }] }
            ];
        }
    });
});
