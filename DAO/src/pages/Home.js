import React, { useEffect, useState } from "react";
import "./pages.css";
import {TabList, Tab, Widget, Tag, Table,Form} from "web3uikit";
import { Link } from "react-router-dom";

import { useMoralis, useMoralisWeb3Api, useWeb3ExecuteFunction } from "react-moralis";

const Home = () => {

  const [passRate, setPassRate] = useState(0);
  const [totalP, setTotalP] = useState(0);
  const [counted, setCounted] = useState(0);
  const [voters, setVoters] = useState(0);
  const { Moralis, isInitialized } = useMoralis();

  const Web3Api = useMoralisWeb3Api();
  const [sub, setSub] = useState();
  const contractProcessor = useWeb3ExecuteFunction();

  const [proposals,setProposals] = useState()


  async function createProposal(newProposal) {
    let options = {
      contractAddress: "0xFf1E3A156d449006544E38E965dde22aE5e16525",
      functionName: "createProposal",
      abi: [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"votesUp","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"votesDown","type":"uint256"},{"indexed":false,"internalType":"address","name":"voter","type":"address"},{"indexed":false,"internalType":"uint256","name":"proposal","type":"uint256"},{"indexed":false,"internalType":"bool","name":"voteFor","type":"bool"}],"name":"newVote","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"id","type":"uint256"},{"indexed":false,"internalType":"bool","name":"passed","type":"bool"}],"name":"proposalCount","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"id","type":"uint256"},{"indexed":false,"internalType":"string","name":"description","type":"string"},{"indexed":false,"internalType":"uint256","name":"maxVotes","type":"uint256"},{"indexed":false,"internalType":"address","name":"proposer","type":"address"}],"name":"proposalCreated","type":"event"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"Proposals","outputs":[{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"bool","name":"exists","type":"bool"},{"internalType":"string","name":"description","type":"string"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"uint256","name":"votesUp","type":"uint256"},{"internalType":"uint256","name":"votesDown","type":"uint256"},{"internalType":"uint256","name":"maxVotes","type":"uint256"},{"internalType":"bool","name":"countConducted","type":"bool"},{"internalType":"bool","name":"passed","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_tokenId","type":"uint256"}],"name":"addTokenId","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"}],"name":"countVotes","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"_description","type":"string"},{"internalType":"address[]","name":"_canVote","type":"address[]"}],"name":"createProposal","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"validTokenIDs","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"},{"internalType":"bool","name":"_vote","type":"bool"}],"name":"voteOnProposal","outputs":[],"stateMutability":"nonpayable","type":"function"}]
           ,
      params: {
        _description: newProposal,
        _canVote: voters,
      },
    };


    await contractProcessor.fetch({
      params: options,
      onSuccess: () => {
        console.log("Proposal Succesful");
        setSub(false);
      },
      onError: (error) => {
        alert(error.data.message);
        setSub(false);
      },
    });


  }


  const getStatus = async (proposalId) =>  {
    const ProposalCounts = Moralis.Object.extend("Count");
    const query = new Moralis.Query(ProposalCounts);
    query.equalTo("uid", proposalId);
    const result = await query.first();
    if (result !== undefined) {
      if (result.attributes.passed) {
        return { color: "green", text: "Passed" };
      } else {
        return { color: "red", text: "Rejected" };
      }
    } else {
      return { color: "blue", text: "Ongoing" };
    }
  }


  useEffect(() => {
    // console.log(isInitialized)
    if (isInitialized) {

      async function getProposals() {
        const Proposals = Moralis.Object.extend("Proposal");
        console.log(Proposals)
        const query = new Moralis.Query(Proposals);
        query.descending("uid_decimal");
        const results = await query.find();
        const table = await Promise.all(
          results.map(async (e) => [
            e.attributes.uid,
            e.attributes.description,
            <Link to="/proposal" state={{
              description: e.attributes.description,
              color: (await getStatus(e.attributes.uid)).color,
              text: (await getStatus(e.attributes.uid)).text,
              id: e.attributes.uid,
              proposer: e.attributes.proposer
              
              }}>
              <Tag
                color={(await getStatus(e.attributes.uid)).color}
                text={(await getStatus(e.attributes.uid)).text}
              />
            </Link>,
          ])
        );
        setProposals(table);
        setTotalP(results.length);
      }


      async function getPassRate() {
        const ProposalCounts = Moralis.Object.extend("Count");
        const query = new Moralis.Query(ProposalCounts);
        const results = await query.find();
        let votesUp = 0;

        results.forEach((e) => {
          if (e.attributes.passed) {
            votesUp++;
          }
        });

        setCounted(results.length);
        setPassRate((votesUp / results.length) * 100);
      }


      const fetchTokenIdOwners = async () => {
        const options = {
          address: "0x2953399124F0cBB46d2CbACD8A89cF0599974963",
          token_id:
            "4355215207997603174917320179892390414915335483180348621717618332080959127563",
          chain: "mumbai",
        };
        const tokenIdOwners = await Web3Api.token.getTokenIdOwners(options);
        console.log(tokenIdOwners)
        const addresses = tokenIdOwners.result.map((e) => e.owner_of);
        setVoters(addresses);
        console.log(voters)
      };


      fetchTokenIdOwners();
      getProposals();
      getPassRate();
      
    }
  }, [isInitialized]);

 


  return (

    <>

      
      <div className="content">
      <TabList defaultActiveKey={2} tabStyle="bulbUnion">

        <Tab tabKey={1} tabName="DAO">

        {proposals && (

          <div className="tabContent">
            Governance Overview
            <div className="widgets">

            <Widget 
            info={totalP} title={"Proposal Created"} style={{width: "200%"}} >


            <div className="extraWidgetInfo">
                <div className="extraTitle">Pass Rate</div>
                <div className="progress">
                        <div className="progressPercentage"
                            style={{width: `${passRate}%`}}>
                        </div>
                </div>


            </div>

            </Widget>
         

            <Widget  info={voters.length} title={"Eligible Voters"} style={{width: "200%"}} />

            <Widget  info={totalP - counted} title={"Ongoing Proposals"} style={{width: "200%"}} />

            </div>
            Recent proposals

            <div style={{marginTop: '30px'}}>
            <Table
            columnsConfig="22% 60% 20%"
            data={proposals} 
            header={[
              <span>Proposal ID</span>,
              <span>Descripton</span>,
              <span>Status</span>,
            ]}
            pageSize={5}
            />



<Form
                  buttonConfig={{
                    isLoading: sub,
                    loadingText: "Submitting Proposal",
                    text: "Submit",
                    theme: "secondary",
                  }}
                  data={[
                    {
                      inputWidth: "100%",
                      name: "New Proposal",
                      type: "textarea",
                      validation: {
                        required: true,
                      },
                      value: "",
                    },
                  ]}
                  onSubmit={(e) => {
                   setSub(true)
                   createProposal(e.data[0].inputResult);
                  }}
                  title="Create a New Proposal"
                />



            </div>
       
    

          </div>

          )}
          
        </Tab>

        <Tab tabKey={2} tabName="Forum" ></Tab>
        <Tab tabKey={3} tabName="Docs"></Tab>

      </TabList>
      </div>
    </>
  );
};

export default Home;
