import React, { useEffect, useState } from "react";
import { Collapse, Space, Select, AutoComplete, notification } from "antd";
import { MatrixModal } from '../../component/modal'
import AddFixMatrixModalContent from './container/modal.fixmatrix.container'
import DefaultFixMatrixModalContent from './container/modal.default.fixmatrix.container'
import IsarogLinerFixMatrixModalContent from './container/modal.isarog.fixmatrix.container'
import MatrixModalContent from './container/modal.matrix.default.container'


import BicolIsarogMatrixModalContent from './container/modal.matrix.bicolisarog.container'
import FiveStarMatrixModalContent from './container/modal.matrix.fivestar.container'
import FiveStarMatrixModalLenghtRange from './container/modal.matrix.fivestar.lenghtRange'
import FiveStarMatrixModalWeightRange from './container/modal.matrix.fivestar.weightRange'
import BicolIsarogMatrixModalWeightRange from './container/modal.matrix.bicolisarog.weightRange'

import { getBusPartner } from '../../utility/busCompanies'

import { UserProfile, getHeaderContainer } from "../../utility";
import MatrixService from "../../service/Matrix";
import "./priceMatrix.css"

const { Panel } = Collapse;
const { Option } = Select;


function DltbMatrix(props) {

    const [state, setState] = useState({
        startName: "",
        fixMatrixOriginId: "",
        fixMatrixDestinationId: "",
        fixMatrixOriginName: "",
        fixMatrixDestinationName: "",
        destination: "",
        destinationList: [],
        tempDestinationList: [],
        matrixList: [],
        tempMatrixObject: [],
        tempOriginList: [],
        tempDestination: [],
        originMatrix: [],
        fixPriceOriginList: [],
        tempFixMatrixObject: { matrix: [], fixMatrix: [] },
    })

    const [busPartner, setBusPartner] = useState(getBusPartner())

    const [fixPriceModal, setFixPriceModal] = useState({
        visible: false,
        data: undefined,
        type: undefined
    })

    const [matrixModal, setMatrixModal] = useState({
        title: "Update Matrix",
        visible: false,
        data: undefined,
        type: undefined
    })

    const [lenghtRangeModal, setLenghtRangeModal] = useState({
        title: "Lenght Range Details",
        visible: false,
        data: undefined,
        type: undefined
    })

    const [weightRangeModal, setWeightRangeModal] = useState({
        title: "Weight Range Details",
        visible: false,
        data: undefined,
        type: undefined
    })

    useEffect(() => {
        console.info('matrix', props)
        const originList = [...props.data.originList]
        setState(e => ({
            ...e,
            tempOriginList: originList,
            fixPriceOriginList: originList
        }))
    }, [props.data.originList])


    const getListName = (id, data) => {
        const result = data.find(e => e.stationId === id);
        return result.stationName || "";
    }

    const parsePriceMatrix = (result) => {
        const { success, data, errorCode } = result.data;
        console.info('result', result)
        if (!errorCode) {
            let fixMatrix = [];
            let matrix = []
            if (!data) {
                fixMatrix = [{ ...props.data.FIX_PRICE_FORMAT }]
                matrix = []
            } else {
                const stringValue = JSON.parse(data.stringValues)
                fixMatrix = stringValue.fixMatrix.length > 0 ? stringValue.fixMatrix : [{ ...props.data.FIX_PRICE_FORMAT }]
                matrix = stringValue.matrix || []
            }
            return { matrix, fixMatrix }
        } else {
            props.data.handleErrorNotification(errorCode)
        }
    }

    const requestUpdate = ({ originId, destinationId, stringValues }, callback) => {
        MatrixService.create({
            busCompanyId: UserProfile.getBusCompanyId(),
            origin: originId,
            destination: destinationId,
            stringValues,
        }).then(async (e) => {
            const { success, errorCode } = e.data;
            if (!errorCode) {
                notification["success"]({
                    message: "Updated Successfuly",
                    description: "All data are updated",
                });
            } else {
                props.data.handleErrorNotification(errorCode)
            }
            callback();
        });
    }

    const updateMatrix = async (val) => {

        console.log('updateMatrix val', val)

        const matrix = busPartner.processMatrixObject(val)
        const index = matrixModal.data.index
        let dataSource = [...busPartner.getMatrixDataSource()];
        let item = dataSource[index];

        requestUpdate({
            originId: matrixModal.data.originId,
            destinationId: matrixModal.data.destinationId,
            stringValues: JSON.stringify({ matrix, fixMatrix: item.fixMatrix || [] })
        }, () => {
            dataSource[index] = { ...dataSource[index], ...val }
            busPartner.setMatrixDataSource(dataSource)
            setMatrixModal(e => ({ ...e, visible: false, matrixInfo: undefined, data: undefined }))
        })
    }

    const updateFixPriceFiveStartMatrix = (values, data) => {

        console.info("updateFixPriceFiveStartMatrix", data, values)

        let _fixMatrix = undefined;
        switch (data.type) {
            case 'add':
                _fixMatrix = [...state.tempFixMatrixObject.fixMatrix]
                _fixMatrix.push(values)
                break

            case "edit":
                _fixMatrix = [...state.tempFixMatrixObject.fixMatrix]
                _fixMatrix[data.index] = values;
                break;

            case "delete":
                _fixMatrix = [...state.tempFixMatrixObject.fixMatrix]
                _fixMatrix = _fixMatrix.filter((e, i) => i !== data.index)
                break;

            default:
                break;
        }

        const tempFixMatrixObject = { ...state.tempFixMatrixObject, fixMatrix: _fixMatrix }
        const { fixMatrixDestinationId, fixMatrixOriginId } = state;

        requestUpdate({
            originId: fixMatrixOriginId,
            destinationId: fixMatrixDestinationId,
            stringValues: JSON.stringify(tempFixMatrixObject)
        }, () => {
            busPartner.setPriceMatrix(tempFixMatrixObject)
            setState(e => ({ ...e, tempFixMatrixObject }))
            setFixPriceModal(e => ({ ...e, visible: false, matrixInfo: undefined, data: undefined }))
        })
    }

    const onSelect = async (name, val) => {
        let response = undefined;
        switch (name) {
            case "startName":
                response = await props.data.getAllRoutesByOrigin(val);
                console.info('tempDestination', response)
                busPartner.parseMatrixDataSource(response)
                setState(e => {
                    return {
                        ...e,
                        startName: getListName(val, props.data.originList),
                        originMatrix: response,
                        tempDestination: response
                    }
                });
                break;

            case "fixMatrixOriginName":
                response = await props.data.getAllRoutesByOrigin(val);
                console.info('fixMatrixOriginName', response)
                setState(e => ({
                    ...e,
                    fixMatrixOriginId: val,
                    fixMatrixOriginName: getListName(val, props.data.originList),
                    fixMatrixDestinationName: "",
                    fixMatrixDestinationId: "",
                    tempDestinationList: props.data.getEndStations(val, response),
                    destinationList: props.data.getEndStations(val, response)
                }));
                break;

            case "fixMatrixDestinationName":
                const result = await props.data.getMatrix(state.fixMatrixOriginId, val)
                const tempFixMatrixObject = parsePriceMatrix(result);
                console.info("tempFixMatrixObject", tempFixMatrixObject)
                busPartner.setPriceMatrix(tempFixMatrixObject)
                setState(e => ({
                    ...e,
                    tempFixMatrixObject,
                    fixMatrixDestinationId: val,
                    fixMatrixDestinationName: getListName(val, state.destinationList)
                }));
                break;

            case 'origin-search':
                const toSearch = val.toLowerCase();
                let tempOriginList = props.data.originList
                    .filter((e) => e.stationName.toLowerCase().includes(toSearch))
                setState(e => ({ ...e, tempOriginList, startName: toSearch }))
                break;

            case 'destination-search':
                let tempDestination = state.originMatrix
                    .filter((e) => e.endStationName.toLowerCase().includes(val.toLowerCase()))
                busPartner.parseMatrixDataSource(tempDestination)
                setState(e => ({ ...e, tempDestination, destination: val.toLowerCase() }))
                break;

            case "search-fixMatrixOriginStation":
                let fixPriceOriginList = props.data.originList
                    .filter((e) => e.stationName.toLowerCase().includes(val.toLowerCase()))
                setState(e => ({ ...e, fixPriceOriginList, fixMatrixOriginName: val.toLowerCase() }))
                break;

            case "search-fixMatrixDestinationStation":
                let tempDestinationList = state.destinationList
                    .filter((e) => e.stationName.toLowerCase().includes(val.toLowerCase()))
                setState(e => ({ ...e, tempDestinationList, fixMatrixDestinationName: val.toLowerCase() }))
                break;

            default: break;
        }
    }

    const broadcastListener = (e) => {
        const { data, action, index } = e
        switch (action) {

            case "view-length-click":
                setLenghtRangeModal(e => ({ ...e, visible: true, data, index }))
                break;

            case "view-weight-click":
                setWeightRangeModal(e => ({ ...e, visible: true, data, index }))
                break;

            case "update-click":
                setMatrixModal(e => ({
                    ...e,
                    visible: true,
                    data: {
                        ...data,
                        index
                    },
                    matrixInfo: {
                        destination: data.destination,
                        destinationId: data.destinationId,
                        originId: data.originId,
                        fixMatrix: data.fixMatrix,
                        index
                    }
                }))
                break;

            case "edit-fixmatrix-click":
                setFixPriceModal(e => ({
                    ...e, title: "Edit Fix Price", visible: true, type: "edit", data: {
                        ...data,
                        index,
                        names: state.tempFixMatrixObject.fixMatrix
                    }
                }))
                break;

            case "del-fixmatrix-click":
                setFixPriceModal(e => ({
                    ...e, title: "Edit Fix Price", visible: true, type: "delete", data: {
                        ...data,
                        index
                    }
                }))
                break;

            case "add-fixmatrix-click":
                setFixPriceModal(e => ({
                    ...e,
                    title: "Add Fix Price",
                    visible: true,
                    type: "add",
                    data: {
                        ...data
                    }
                }))
                break;

            case "update-click":
                setMatrixModal(e => ({ ...e, visible: true, data: { ...data, index } }))
                break;

            default:
                break;

        }
    }

    const MatrixModalContainer = () => {
        let view = undefined;
        switch (busPartner.getName()) {
            case "dltb":
                view = (<MatrixModalContent
                    {...props}
                    okText="Update"
                    cancelText="Cancel"
                    data={matrixModal.data}
                    onCancel={() => setMatrixModal(e => ({ ...e, visible: false, data: undefined }))}
                    onSubmit={(val, data) => updateMatrix(val, data)} />)
                break;

            case "five-star":
                view = (<FiveStarMatrixModalContent
                    {...props}
                    okText="Update"
                    cancelText="Cancel"
                    data={matrixModal.data}
                    onCancel={() => setMatrixModal(e => ({ ...e, visible: false, data: undefined }))}
                    onSubmit={(val) => updateMatrix(val)} />
                )
                break;

            case "isarog-liner":
                view = (<BicolIsarogMatrixModalContent
                    {...props}
                    okText="Update"
                    cancelText="Cancel"
                    data={matrixModal.data}
                    onCancel={() => setMatrixModal(e => ({ ...e, visible: false, data: undefined }))}
                    onSubmit={(val) => updateMatrix(val)} />
                )
                break;


            default:
                break;
        }
        return view;
    }

    const MatrixModalWeightRange = () => {
        let view = undefined;
        switch (busPartner.getName()) {

            case "isarog-liner":
                view = (<BicolIsarogMatrixModalWeightRange
                    {...props}
                    cancelText="Ok"
                    data={weightRangeModal.data}
                    onCancel={() => setWeightRangeModal(e => ({ ...e, visible: false, data: undefined }))}
                    onSubmit={(val, data) => { }} />
                )
                break;


            default:
                view = <FiveStarMatrixModalWeightRange
                    {...props}
                    cancelText="Ok"
                    data={weightRangeModal.data}
                    onCancel={() => setWeightRangeModal(e => ({ ...e, visible: false, data: undefined }))}
                    onSubmit={(val, data) => { }} />
                break;
        }
        return view;
    }

    const MatrixModalLenghtRange = () => {
        let view = undefined;
        switch (busPartner.getName()) {
            default:
                view = <FiveStarMatrixModalLenghtRange
                    {...props}
                    cancelText="Ok"
                    data={lenghtRangeModal.data}
                    onCancel={() => setLenghtRangeModal(e => ({ ...e, visible: false, data: undefined }))}
                    onSubmit={(val, data) => { }} />
                break;
        }
        return view;
    }

    const FixMatrixModalContainer = (props) => {
        let View = undefined;
        switch (UserProfile.getBusCompanyTag()) {
            case "dltb":
                View = (<AddFixMatrixModalContent
                    {...props}
                    type={fixPriceModal.type}
                    okText={fixPriceModal.type === 'delete' ? fixPriceModal.type : "Save"}
                    cancelText="Cancel"
                    data={fixPriceModal.data}
                    onCancel={() => setFixPriceModal(e => ({ ...e, visible: false, data: undefined }))}
                    onSubmit={(val, data) => updateFixPriceFiveStartMatrix(val, data)} />)
                break;

            case "isarog-liner":
                View = (<IsarogLinerFixMatrixModalContent
                    {...props}
                    type={fixPriceModal.type}
                    okText={fixPriceModal.type === 'delete' ? fixPriceModal.type : "Save"}
                    cancelText="Cancel"
                    data={fixPriceModal.data}
                    onCancel={() => setFixPriceModal(e => ({ ...e, visible: false, data: undefined }))}
                    onSubmit={(val, data) => updateFixPriceFiveStartMatrix(val, data)} />)
                break;

            default:
                View = (<DefaultFixMatrixModalContent
                    {...props}
                    type={fixPriceModal.type}
                    okText={fixPriceModal.type === 'delete' ? fixPriceModal.type : "Save"}
                    cancelText="Cancel"
                    data={fixPriceModal.data}
                    onCancel={() => setFixPriceModal(e => ({ ...e, visible: false, data: undefined }))}
                    onSubmit={(val, data) => updateFixPriceFiveStartMatrix(val, data)} />)
                break;
        }
        return View;
    }

    return (
        <div>
            <div style={{
                padding: '1rem',
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                flexDirection: 'column',
                width: '100%'
            }}>

                <span style={{ fontSize: '1.5rem', fontWeight: 400 }}>Price Matrix</span>
                <span style={{ fontSize: '1.2rem', fontWeight: 300 }}>{UserProfile.getBusCompanyName()}</span>

            </div>

            <div style={{ padding: '1rem' }}>
                <Collapse defaultActiveKey={['1']} style={{ marginBottom: '2.5rem' }}>
                    <Panel style={{ background: getHeaderContainer() }} header="Price Matrix" key="1">
                        <div style={{ width: 610, display: 'flex', flexDirection: 'row', justifyContent: "space-around" }}>
                            <Space direction="vertical">
                                <label>Origin Station:</label>
                                <AutoComplete
                                    value={state.startName}
                                    placeholder="Origin Station"
                                    style={{ width: 300, marginBottom: '1rem' }}
                                    onSearch={(e) => onSelect('origin-search', e)}
                                    onSelect={(e) => onSelect("startName", e)}>
                                    {
                                        state.tempOriginList.map(e => (<Option value={e.stationId}>{e.stationName}</Option>))
                                    }
                                </AutoComplete>
                            </Space>
                            <Space direction="vertical" style={{ marginLeft: '1rem' }}>
                                <label>End Destination:</label>
                                <AutoComplete
                                    value={state.destination}
                                    placeholder="End Station"
                                    style={{ width: 300, marginBottom: '1rem' }}
                                    onSearch={(e) => onSelect('destination-search', e)} />
                            </Space>
                        </div>
                        {
                            <>{busPartner.getMatrixTable((c) => broadcastListener(c))} </>
                        }
                    </Panel>
                </Collapse>
                <Collapse>
                    <Panel style={{ background: getHeaderContainer(), fontColor: '#fff' }} header="Fix Price Matrix" key="1">
                        <div style={{ width: 610, display: 'flex', flexDirection: 'row', justifyContent: "space-around" }}>
                            <Space direction="vertical">
                                <label>Origin Station:</label>
                                <AutoComplete
                                    value={state.fixMatrixOriginName}
                                    placeholder="Origin"
                                    style={{ width: 300, marginBottom: '1rem' }}
                                    onSearch={(e) => onSelect("search-fixMatrixOriginStation", e)}
                                    onSelect={(e) => onSelect("fixMatrixOriginName", e)}>
                                    {
                                        state.fixPriceOriginList.map(e => (<Option value={e.stationId}>{e.stationName}</Option>))
                                    }
                                </AutoComplete>
                            </Space>
                            <Space direction="vertical">
                                <label>End Destination:</label>
                                <AutoComplete
                                    value={state.fixMatrixDestinationName}
                                    placeholder="Destination"
                                    style={{ width: 300, marginBottom: '1rem' }}
                                    onSearch={(e) => onSelect("search-fixMatrixDestinationStation", e)}
                                    onSelect={(e) => onSelect("fixMatrixDestinationName", e)}>
                                    {
                                        state.tempDestinationList.map(e => (<Option value={e.stationId}>{e.stationName}</Option>))
                                    }
                                </AutoComplete>
                            </Space>


                        </div>
                        {
                            <>{busPartner.getFixPriceTableComponent((c) => broadcastListener(c))}</>
                        }
                    </Panel>
                </Collapse>
            </div>

            {/* Fix Price Matrix Modal */}
            <MatrixModal
                onCancel={() => setFixPriceModal(e => ({ ...e, visible: false, data: undefined }))}
                visible={fixPriceModal.visible}
                title={fixPriceModal.title}>
                <FixMatrixModalContainer {...props} />
            </MatrixModal>

            {/* Matrix Modal */}
            <MatrixModal
                onCancel={() => setMatrixModal(e => ({ ...e, visible: false, data: undefined }))}
                visible={matrixModal.visible}
                width={900}
                title={matrixModal.title}>
                <MatrixModalContainer {...props} />
            </MatrixModal>

            {/* Lenght Ragne Modal */}
            <MatrixModal
                onCancel={() => setLenghtRangeModal(e => ({ ...e, visible: false, data: undefined }))}
                width={500}
                visible={lenghtRangeModal.visible}
                title={lenghtRangeModal.title}>
                <MatrixModalLenghtRange {...props} />
            </MatrixModal>

            {/* Weight Ragne Modal */}
            <MatrixModal
                width={500}
                onCancel={() => setWeightRangeModal(e => ({ ...e, visible: false, data: undefined }))}
                visible={weightRangeModal.visible}
                title={weightRangeModal.title}>
                <MatrixModalWeightRange {...props} />
            </MatrixModal>

        </div>
    )
}

export default DltbMatrix;