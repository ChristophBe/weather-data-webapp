import React, {Component, Fragment} from 'react';
import chroma from 'chroma-js';
import HeaderNav from "./HeaderNav";
import {BrowserRouter as Router, Link, Redirect, Route, Switch} from "react-router-dom";
import MeasuringComponent from "./components/MeasuringComponent";
import LoginComponent from "./components/LoginComponent";
import AuthActions from "./redux/actions/AuthActions";
import {connect} from "react-redux";
import NodesActions from "./redux/actions/NodesActions";
import ShareNodeView from "./components/ShareNodeView";
import CreateUserView from "./components/CreateUserView";
import CreateNodeComponent from "./components/CreateNodeComponent";


class App extends Component {

    static calcBackgroundColor(currentTemperature) {
        let scale = chroma.scale(['#0400ff', '#00a1ff', '#f9a100', '#f94500']);
        let tempOnColorScale = (currentTemperature + 10) / 50;
        tempOnColorScale = tempOnColorScale < 0 ? 0 : tempOnColorScale;
        tempOnColorScale = tempOnColorScale > 1 ? 1 : tempOnColorScale;
        return scale(tempOnColorScale).hex();
    }

    componentDidMount() {
        this.props.tryCookieAuth();
        this.props.fetchNodes();
    }

    render() {

        console.log("props", this.props)
        const {nodes, measurements} = this.props;


        if (!nodes.isLoading && nodes.length <= 0) {
            return <div className="App">
                <div className="main-content">
                    <div className={"container"}>
                        <LoginComponent/>
                    </div>
                </div>
            </div>
        }
        if (nodes.isLoading || nodes.selectedNode == null) {
            return <div className="App">
                <div className="main-content">
                    <h1>Die Messstationen werden geladen</h1>
                </div>
            </div>
        }

        const style = {};

        if (measurements[nodes.selectedNode] != null
            && measurements[nodes.selectedNode].items.length > 0) {
            style["background"] = App.calcBackgroundColor(measurements[nodes.selectedNode].items[0].temperature)
        }


        return (
            <div className="App" style={style}>
                <Router>

                    <Fragment>
                        <HeaderNav/>
                        <section className="main-content">
                            <div className={"container"}>
                                <Switch>
                                    <Route path="/users/login" component={LoginComponent}/>
                                    <Route path="/users/:token" render={({match}) => <CreateUserView token={match.params.token}/>}/>
                                    <Route path="/nodes/:nodeId/share" render={({match}) => <ShareNodeView nodeId={Number(match.params.nodeId)}/>}/>
                                    <Route path="/nodes/:nodeId" render={({match}) => <MeasuringComponent nodeId={Number(match.params.nodeId)}/>}/>
                                    <Route path="/nodes" component={CreateNodeComponent}/>
                                    <Redirect from={"/"} to={"/nodes/" + nodes.selectedNode}/>
                                </Switch>
                            </div>
                        </section>
                        {Object.keys(nodes.map).length > 1
                            ? <div className={"bottom-nav"}>
                                <div className={"container"}>
                                    <nav>
                                        {
                                            Object.keys(nodes.map).map((key, index) => <Link
                                                className={"btn btn-outline-light"} key={index}
                                                to={"/nodes/" + key}>{nodes.map[key].name}</Link>)
                                        }
                                    </nav>
                                </div>
                            </div> : null
                        }

                    </Fragment>
                </Router>

            </div>
        );
    }
}


const mapStateToProps = (state) => ({
    auth: state.auth,
    nodes: state.nodes,
    measurements: state.measurements,
});

const mapDispatchToProps = {
    doLogin: AuthActions.doLogin,
    tryCookieAuth: AuthActions.tryCookieAuth,
    fetchNodes: NodesActions.fechNodes
};

export default connect(mapStateToProps, mapDispatchToProps)(App);