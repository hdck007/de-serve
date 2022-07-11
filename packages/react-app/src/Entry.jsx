import React from "react";
import { Link, Route, Switch, useLocation } from "react-router-dom";
import CreateSurvey from "./views/CreateSurvey";
import HomePage from "./views/HomePage";
import Survey from "./views/Survey";

function App(props) {
  return (
    <Switch>
      <Route exact path="/">
        <HomePage />
      </Route>
      <Route path="/create-survey">
        <CreateSurvey />
      </Route>
      <Route path="/survey/:id">
        <Survey />
      </Route>
    </Switch>
  );
}

export default App;
