import RequestService from "./RequestService";
import {Config} from "../config";


export class NodesService {

    static fetchNodes(authToken){
        return RequestService.doGet(Config.apiBaseUrl + "/nodes" , {},authToken);
    }

    static saveNodes(node, authToken){
        return RequestService.doPost(Config.apiBaseUrl + "/nodes" , node,true,{},authToken);
    }

    static fetchNodesByOwnersUserId(userId, authToken){
        return RequestService.doGet(Config.apiBaseUrl + "/users/" +  userId + "/nodes" , {},authToken);
    }
    static fetchNodeApiTokenByNodeId(nodeId, authToken){
        return RequestService.doGet(Config.apiBaseUrl + "/nodes/" + nodeId + "/api-token" , {},authToken);
    }

    static shareNode(nodeId, email, authToken){
        const payLoad = {email};
        return RequestService.doPost(Config.apiBaseUrl + "/nodes/" +  nodeId + "/share" , payLoad,true,{},authToken);
    }


}