import React from "react";
import {Button,Col,Row,notification,Input} from "antd";
import { DeleteFilled } from "@ant-design/icons";

import "./priceMatrix.css";

function FixPriceMatrix(props) {
    let fixMatrix = props.fixMatrix ? [...props.fixMatrix] : [];
  
    return(<div style={{ display:`${fixMatrix.length > 0 ? 'block' : 'none'}`, marginTop: "3rem" }}>
            <span style={{paddingBottom:'2rem', paddingTop:'2rem', fontSize:'14px'}}>Fix Price</span>
            {fixMatrix.map((e, index) => {
              return (
                <div key={index} style={{ width: "100%" }}>
                  <Row>
                    <Col style={{ paddingBottom: "0.2rem" }}>
                      <span style={{fontSize:'12px'}}>Description</span>
                      <Input
                        value={e.name}
                        onChange={(e) =>
                          props.onFixMatrixChange(index, "name", e.target.value)
                        }
                        name="description"
                      />
                    </Col>
                    <Col
                      style={{ paddingLeft: "0.2rem", paddingBottom: "0.2rem" }}
                    >
                      <span style={{fontSize:'12px'}}>Price</span>
                      <Input
                        type="number"
                        name="price"
                        onChange={(e) =>
                          props.onFixMatrixChange(index, "price", e.target.value)
                        }
                        value={e.price}
                      />
                    </Col>
                    <Col
                      style={{ paddingLeft: "0.2rem", paddingBottom: "0.2rem" }}
                    >
                      <span style={{fontSize:'12px'}}>Declared Value Rate (%)</span>
                      <Input
                        type="number"
                        name="declaredValue"
                        onChange={(e) =>
                          props.onFixMatrixChange(
                            index,
                            "declaredValue",
                            e.target.value
                          )
                        }
                        value={e.declaredValue}
                      />
                    </Col>
                    <Col
                      style={{ paddingLeft: "0.2rem", marginTop:'1.4rem', paddingBottom: "0.2rem" }}
                    >
                      <Button
                        onClick={() => {
                          let _fixMatrix = [...fixMatrix];
                          _fixMatrix.splice(index, 1);
                          // this.setState({ fixMatrix });
                          props.onDeleteItem(_fixMatrix)
                        }}
                        shape="circle"
                        type="danger"
                      >
                        {" "}
                        <DeleteFilled />{" "}
                      </Button>
                    </Col>
                  </Row>
                </div>
              );
            })}
  
            <Row>
              <Button
                onClick={() => {
                  const _fixMatrix = [...fixMatrix];
                  if(_fixMatrix[_fixMatrix.length-1].name === "" && _fixMatrix[_fixMatrix.length-1].price === 0){
                    notification["error"]({
                      description: "Description is required or Price should not be zero",
                      message: "Please fill up missing fields",
                    });
                    return;
                  }
                  _fixMatrix.push({ name: "", price: 0, declaredValue:0 });
                  props.onAddMoreItem(_fixMatrix)
                  //this.setState({ fixMatrix });
                }}
              >
                Add More
              </Button>
            </Row>
          </div>)
  }

  export default FixPriceMatrix