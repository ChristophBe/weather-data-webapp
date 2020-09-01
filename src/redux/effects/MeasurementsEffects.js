import {call, put, select} from "redux-saga/effects";
import MeasurementsActions from "../actions/MeasurementsActions";
import {MeasurementsService} from "../../services/MeasurementsService";

const getAuth = (state) => state.auth;

export function* fetchMeasurements(action) {
    try {
        const {token} = yield select(getAuth);
        const nodes = yield call(MeasurementsService.fetchMeasurementsByNodeId, action.nodeId, token);
        yield put(MeasurementsActions.receiveMeasurements(action.nodeId,nodes))
    }
    catch (e) {
        yield put(MeasurementsActions.measurementsRequestFailed(action.nodeId))
    }
}