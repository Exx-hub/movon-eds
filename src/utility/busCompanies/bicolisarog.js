import React from "react";
import { Table, Button, Space, Tag } from "antd";
import { PlusOutlined } from "@ant-design/icons";

class BicolIsarog {
  constructor() {
    this.name = "isarog-liner";
    this.dataSource = [];
    this.priceMatrix = { matrix: [], fixMatrix: [] };
    this.message = {
      BUTTON_UPDATE_CLICK: `update-click`,
      BUTTON_DEL_CLICK: `del-click`,
      BUTTON_VIEW_LENGHT_DETAILS: `view-length-click`,
      BUTTON_VIEW_WEIGHT_DETAILS: `view-weight-click`,
      BUTTON_EDIT_FIXMATRIX: `edit-fixmatrix-click`,
      BUTTON_DEL_FIXMATRIX: `del-fixmatrix-click`,
      BUTTON_ADD_FIXMATRIX: `add-fixmatrix-click`,
    };
  }

  setPriceMatrix(priceMatrix) {
    if (
      priceMatrix.hasOwnProperty("matrix") &&
      priceMatrix.hasOwnProperty("fixMatrix")
    ) {
      this.priceMatrix = priceMatrix;
      this.setFixMatrix(priceMatrix.fixMatrix);
      this.setMatrix(priceMatrix.matrix);
    }
  }

  setMatrix(matrix) {
    this.matrix = matrix;
  }

  setFixMatrix(fixMatrix) {
    let _fixMatrix = fixMatrix.map((e) => {
      return {
        ...e,
        enablePortersFee:
          e.enablePortersFee !== undefined
            ? Boolean(e.enablePortersFee)
            : Boolean(true),
        additionalFee: e.additionalFee || false,
      };
    });
    this.fixMatrix = _fixMatrix;
  }

  setMatrixDataSource(dataSource) {
    this.dataSource = dataSource;
  }

  parseMatrixDataSource(dataSource) {
    const result = dataSource.map((e) => {
      let _value = undefined;
      let fixMatrix = [{}];
      if (e.stringValue) {
        const temp = JSON.parse(e.stringValue);

        if (temp.matrix && temp.matrix.length > 0) {
          _value = temp.matrix[0];

          if (
            !_value.lengthRange &&
            _value.maxAllowedLength &&
            _value.maxAllowedLengthRate
          ) {
            let lengthRange = [];
            _value.maxAllowedLength.forEach((e) => {
              lengthRange.push({ meter: e });
            });
            _value.maxAllowedLengthRate.forEach((e, index) => {
              lengthRange[index] = {
                ...lengthRange[index],
                ...{ percentage: e },
              };
            });
            _value = { ..._value, lengthRange };
          }
          if (
            !_value.weightRange &&
            _value.maxAllowedWeight &&
            _value.exceededPerKilo
          ) {
            let weightRange = [
              {
                weight1: 1,
                weight2: _value.maxAllowedWeight,
                amount: _value.price,
                kiloRate: 0,
              },
              {
                weight1: Number(_value.maxAllowedWeight) + 1,
                weight2: 999,
                amount: 0,
                kiloRate: _value.exceededPerKilo,
              },
            ];
            _value = { ..._value, weightRange };
          }
          if (!_value.accompaniedBaggage) {
            _value.accompaniedBaggage = 0;
          }
          if (!_value.accompaniedBaggageFee) {
            _value.accompaniedBaggageFee = 0;
          }
        }

        if (temp.fixMatrix && temp.fixMatrix.length > 0) {
          fixMatrix = temp.fixMatrix;
        }
      }

      return {
        ..._value,
        fixMatrix,
        destination: e.endStationName,
        destinationId: e.end,
        originId: e.start,
      };
    });
    this.dataSource = result;
  }

  getName() {
    return this.name;
  }

  getMessage(msg) {
    return this.message;
  }

  getMessageName = (msg) => {
    let name = undefined;
    for (const [key, value] of Object.entries(this.message)) {
      if (msg === value) {
        name = key;
      }
    }
    return name;
  };

  getMatrix() {
    return this.matrix;
  }

  getFixMatrix() {
    return this.fixMatrix;
  }

  getFixMatrixFormat() {
    return {
      name: "No Data",
      price: 0,
      declaredValue: 0,
    };
  }

  getMatrixDataSource() {
    return this.dataSource;
  }

  // SETS PRICE MATRIX TABLE - bicol
  getTableColumn(callback) {
    return [
      {
        title: "Destination",
        dataIndex: "destination",
        key: "destination",
      },
      {
        title: "Declared Value Rate %",
        dataIndex: "declaredValueRate",
        key: "declaredValueRate",
        align: "center",
        render: (text) => <span>{Number(text || 0)} %</span>,
      },
      {
        title: "Min Accompanied Baggage",
        dataIndex: "accompaniedBaggage",
        key: "accompaniedBaggage",
        align: "center",
        render: (text) => <span>{Number(text || 0)} kg.</span>,
      },
      {
        title: "Accompanied Baggage Fee",
        dataIndex: "accompaniedBaggageFee",
        key: "accompaniedBaggageFee",
        align: "right",
        render: (text) => <span>??? {Number(text).toFixed(2)}</span>,
      },
      {
        title: "Base Price",
        dataIndex: "price",
        key: "price",
        align: "right",
        render: (text) => <span>??? {Number(text).toFixed(2)}</span>,
      },
      {
        title: "Weight Range",
        dataIndex: "weightRange",
        key: "weightRange",
        render: (text, row, index) => (
          <Button
            onClick={() => {
              callback({
                name: this.name,
                action: this.message.BUTTON_VIEW_WEIGHT_DETAILS,
                data: row,
                index,
              });
            }}
            size="small"
            style={{ background: "orange" }}
          >
            <span
              style={{ color: "white", fontWeight: "bold", fontSize: "11px" }}
            >
              Show Details
            </span>
          </Button>
        ),
      },
      {
        title: "Length Range",
        dataIndex: "lengthRange",
        key: "lengthRange",
        render: (t, row, index) => (
          <Button
            onClick={() => {
              callback({
                name: this.name,
                action: this.message.BUTTON_VIEW_LENGHT_DETAILS,
                data: row,
                index,
              });
            }}
            size="small"
            style={{ background: "orange" }}
          >
            <span
              style={{ color: "white", fontWeight: "bold", fontSize: "11px" }}
            >
              Show Details
            </span>
          </Button>
        ),
      },
      {
        title: "Action",
        dataIndex: "action",
        key: "action",
        width: 150,
        render: (t, row, index) => (
          <Button
            onClick={() => {
              callback({
                name: this.name,
                action: this.message.BUTTON_UPDATE_CLICK,
                data: row,
                index,
              });
            }}
            size="small"
            style={{ background: "green" }}
          >
            <span
              style={{ color: "white", fontWeight: "bold", fontSize: "11px" }}
            >
              Update
            </span>
          </Button>
        ),
      },
    ];
  }

  // SETS PRICE MATRIX TABLE
  getMatrixTable(callback) {
    return (
      <Table
        scroll={{ x: true }}
        bordered={true}
        pagination={false}
        columns={this.getTableColumn(callback)}
        dataSource={this.getMatrixDataSource()}
      />
    );
  }

  // SETS FIX PRICE MATRIX TABLE - bicol
  getFixMatrixTableColumn(callback) {
    return [
      {
        title: "Description",
        dataIndex: "name",
        key: "description",
      },
      {
        title: "Declared Value Rate",
        dataIndex: "declaredValue",
        key: "declaredValue",
      },
      {
        title: "Price",
        dataIndex: "price",
        key: "price",
      },
      {
        title: "Enable Porters Fee",
        dataIndex: "enablePortersFee",
        key: "enablePortersFee",
        render: (val) => {
          return (
            <Tag size="small" color={`${Boolean(val) ? "blue" : "red"}`}>{`${
              val ? (Boolean(val) ? "Enabled" : "Disabled") : "Disabled"
            }`}</Tag>
          );
        },
      },
      {
        title: "Enabled Accompanied Baggage",
        dataIndex: "enabledAccompaniedBaggage",
        key: "enabledAccompaniedBaggage",
        render: (val) => {
          return (
            <Tag size="small" color={`${Boolean(val) ? "blue" : "red"}`}>{`${
              val ? (Boolean(val) ? "Enabled" : "Disabled") : "Disabled"
            }`}</Tag>
          );
        },
      },
      {
        title: "Enable Additional Fee",
        dataIndex: "additionalFee",
        key: "additionalFee",
        render: (val) => {
          return (
            <Tag size="small" color={`${Boolean(val) ? "blue" : "red"}`}>{`${
              val ? (Boolean(val) ? "Yes" : "No") : "No"
            }`}</Tag>
          );
        },
      },
      {
        title: "Action",
        dataIndex: "action",
        key: "action",
        render: (t, row, index) => {
          return (
            <Space>
              <Button
                onClick={() => {
                  callback({
                    name: this.name,
                    action: this.message.BUTTON_EDIT_FIXMATRIX,
                    data: row,
                    index,
                  });
                }}
                size="small"
                style={{ background: "gray" }}
              >
                <span
                  style={{
                    color: "white",
                    fontWeight: "bold",
                    fontSize: "11px",
                  }}
                >
                  Edit
                </span>
              </Button>
              <Button
                onClick={() => {
                  callback({
                    name: this.name,
                    action: this.message.BUTTON_DEL_FIXMATRIX,
                    data: row,
                    index,
                  });
                }}
                size="small"
                style={{ background: "red" }}
              >
                <span
                  style={{
                    color: "white",
                    fontWeight: "bold",
                    fontSize: "11px",
                  }}
                >
                  Remove
                </span>
              </Button>
            </Space>
          );
        },
      },
    ];
  }

  getFixPriceTableComponent(callback) {
    return (
      <>
        <Table
          scroll={{ x: true }}
          style={{ width: 800 }}
          bordered={true}
          pagination={false}
          columns={this.getFixMatrixTableColumn((c) => callback(c))}
          dataSource={this.getFixMatrix()}
        />
        {this.getFixMatrix() && (
          <Button
            style={{ marginTop: "1rem" }}
            block={true}
            type="dashed"
            onClick={() =>
              callback({
                action: this.message.BUTTON_ADD_FIXMATRIX,
                data: {
                  names: this.getFixMatrix().map((e) => ({ name: e.name })),
                },
              })
            }
            icon={<PlusOutlined />}
          >
            Add Fix Price
          </Button>
        )}
      </>
    );
  }

  processMatrixObject(val) {
    const matrix = [{ ...val }];
    return matrix;
  }
}

export default BicolIsarog;
