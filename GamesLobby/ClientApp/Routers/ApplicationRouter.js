// IMPORT PACKAGE REFERENCES
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { FrontendSocket } from '../Lib/Socket/FrontendSocket';

import RoachesPage from '../Skins/Default/Pages/Roaches/RoachesPage';
import RoboDogsPage from '../Skins/Default/Pages/RoboDogs/RoboDogsPage';
import Header from '../Skins/Default/Header/Header';
import Footer from '../Skins/Default/Footer/Footer';

export const appHistory = createBrowserHistory();

const AppRouter = () => {
    return <Router history={appHistory}>
        <React.Suspense fallback={<div></div>}>
            <Header />
            <FrontendSocket />
            <Switch>
                <Route path='/roaches' render={() => <RoachesPage />} exact={true} />
                <Route path='/robo-dogs' render={() => <RoboDogsPage />} exact={true}/>
            </Switch>
            <Footer />
        </React.Suspense>
    </Router >;
};

export default AppRouter;