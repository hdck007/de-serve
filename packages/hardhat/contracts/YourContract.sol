// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;


contract YourContract {

    struct Response {
        string response_json;
        address owner;
    }

    struct Survey {
        string title;
        string questions_json;
        uint participants;
    }

    Survey[] public surveys;
    mapping(uint => Response[]) responses;
    mapping(address => uint[]) user_survey;

    function addSurvey(string memory _title, string memory _json) public {
        surveys.push(Survey({
            title: _title,
            questions_json: _json,
            participants: 0
        }));
    }

    function getSurvey(uint _index) public view returns (Survey memory) {
        Survey memory currentSurvey = surveys[_index];
        return currentSurvey;
    }

    function getAllSurveys() public view returns (Survey[] memory){
        return surveys;
    }

    function addResponse(uint _survey_id, string memory _json) public {
        bool hasNotResponded = true;
        for(uint i = 0; i<user_survey[msg.sender].length; i++){
            if(user_survey[msg.sender][i] == _survey_id){
                hasNotResponded = false;
            }
        }
        require(hasNotResponded, "The user has already responded");
        responses[_survey_id].push(Response({
            response_json: _json,
            owner: msg.sender
        }));
        user_survey[msg.sender].push(_survey_id);
        surveys[_survey_id].participants++;
    }

    function getAllResponsesForSurvey(uint _survey_id) public view returns (Response[] memory){
        return responses[_survey_id];
    }

    function getAllSurveysByUser() public view returns (Survey[] memory){
        uint length = user_survey[msg.sender].length;
        Survey[] memory temp = new Survey[](length);
        for(uint i = 0; i<length; i++){
            temp[i] = surveys[user_survey[msg.sender][i]];
        }
        return temp;
    }
}