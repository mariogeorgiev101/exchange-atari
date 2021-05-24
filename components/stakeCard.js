import React, {useEffect, useState} from 'react';
import SwapForm from './swapForm';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import {Radio, Grid} from '@material-ui/core';
import Web3 from 'web3';
import {web3, atari, fantom, weth,routerAddress, factoryContract, exchangeContract, atariContract, fantomContract, gasLimitHex, PairAbi, factoryAddress, stakeContract, stakeAddress} from './abi/contract';


function StakeCard(){
    const [flag1, setFlag1] = useState(true);
    const [step, setStep] = useState("1");
    const [stepValue, setStepValue] = useState("0");
    const [amount, setAmount] = useState(0);
    const [connect, setConnect] = useState(false);
    const [stakeState, setStakeState] = useState(0);
    const [lockTime, setLockTime] = useState();
    const [returnValue, setReturnValue] = useState(0);
    const [token1, setToken1] = useState("Ether");
    const [flag2, setFlag2] = useState(true);
    const [token2, setToken2] = useState("Ether");
    const [tokenAddress1, setTokenAddress1] = useState("0xc778417e063141139fce010982780140aa0cd5ab");
    const [tokenAddress2, setTokenAddress2] = useState("0xc778417e063141139fce010982780140aa0cd5ab");
    const [amount1, setAmount1] = useState();
    const [amount2, setAmount2] = useState();
    const [loadingStake, setLoadingStake] = useState(false);
    const [loadingWithdraw, setLoadingWithdraw] = useState(false);
    const [screenWidth, setScreenWidth] = useState();

    const handleStake = async () =>{
        if(amount>0){
            if(typeof window !== "undefined"){
                var Data=await atariContract.methods.approve(stakeAddress,web3.utils.toWei(amount.toString())).encodeABI();
                var Txdetail = {
                            from: window.ethereum.selectedAddress,
                            to: atari,
                            value: web3.utils.toHex(web3.utils.toWei("0")),
                            gas: web3.utils.toHex(210000),
                            gasPrice: web3.utils.toHex(web3.utils.toWei('30', 'gwei')),
                            data:Data
                        }

                window.ethereum.request({ method: 'eth_sendTransaction', params: [Txdetail] }).then(async (res) => {
                    console.log(res);
                    var ethFlag = true;
                    while(ethFlag){
                        await web3.eth.getTransactionReceipt(res,async (error, receipt) => {
                            if (error) {
                                console.log(error)
                            } else if (receipt == null) {
                                    console.log("repeat")
                            } else {
                                console.log("confirm", receipt)
                                ethFlag = false;
                                var Data = await stakeContract.methods.stake(amount,stepValue).encodeABI();
                                var Txdetail = {
                                    from: window.ethereum.selectedAddress,
                                    to: stakeAddress,
                                    value: web3.utils.toHex(web3.utils.toWei("0")),
                                    gas: web3.utils.toHex(210000),
                                    gasPrice: web3.utils.toHex(web3.utils.toWei('30', 'gwei')),
                                    data:Data
                                }
                                window.ethereum.request({ method: 'eth_sendTransaction', params: [Txdetail] }).then(async (res) => {
                                    console.log(res);
                                    var ethFlag = true;
                                    while(ethFlag){
                                        await web3.eth.getTransactionReceipt(res,async (error, receipt) => {
                                            if (error) {
                                                console.log(error)
                                            } else if (receipt == null) {
                                                    console.log("repeat")
                                            } else {
                                                console.log("confirm", receipt)
                                                ethFlag = false;
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    }
                })
            }
        }
    }

    const handleWithdraw = () =>{

    }

    const handleStep = (e,v) =>{
        setStep(v);
        setReturnValue(Number(amount)+Number(amount*v/100));
        if(v==1)
            setStepValue(0);
        else if(v==3)
            setStepValue(1);
        else if(v==10)
            setStepValue(2);
        else
            setStepValue(3);
    }

    const handleAmount = (e) =>{
        if(e.target.value>0){
            setAmount(e.target.value)
           setReturnValue(Number(e.target.value)+Number(e.target.value*step/100))
        }
    }

    useEffect( async ()=>{
        if(typeof window !== "undefined"){
        if(window.ethereum){
                setFlag1(false)
                var web3 = new Web3();
                web3 = new Web3(window.ethereum);
                const accounts = await web3.eth.getAccounts();
                if(accounts.length!=0){
                    setConnect(true);
                    var data = await stakeContract.methods.getamount(window.ethereum.selectedAddress).call();
                    var lock = await stakeContract.methods.getlocktime(window.ethereum.selectedAddress).call();
                    setStakeState(data);
                    var lockDate = new Date(); // Epoch
                    lockDate.setSeconds(lock);
                    setLockTime(lockDate);
                }
            }
        }
    })



   
    return(
        <div className = "x-swapCard-container" style = {screenWidth>800?{paddingLeft:"70px", paddingRight: "70px"}:{paddingRight: "10px", paddingLeft: "10px"}}>
        {stakeState==0?(
                <div>
                    <div className = "x-font1 text-center">
                        Stake
                    </div>
                    <div className = "x-font2 text-center mb-5">
                        {connect?`Metamask Connected`:`please connect metamask`}
                    </div>
                    <div className = "x-font3">
                        Amount
                    </div>
                    <Grid container>
                        <Grid item xs = {7} sm = {8} md = {9}>
                            <input type = "number" className = "x-swapForm-input" onChange = {handleAmount}/>
                            <span>atari</span>
                        </Grid> 
                        <Grid item xs = {5} sm = {4} md = {3} className = "x-stake-field">
                            <div>
                                <img src = {`/img/token/atari.png`} width = "40px"/>
                                <span className = "x-swapForm-token x-font3">atari</span>
                            </div>
                        </Grid>
                    </Grid>
                    <div className = "x-font3 mt-4">
                        Step
                    </div>
                    <Grid container spacing = {3}>
                    <Grid item xs = {1} sm = {2} md = {3}></Grid>
                        <Grid item xs = {10} sm = {8} md = {6}>
                        <div>
                            <Radio
                                checked={step=="1"}
                                onChange={(e)=>handleStep(e,"1")}
                                name="radio-button-demo"
                                color = "primary"
                                inputProps={{ 'aria-label': 'A' }}
                            />
                            <span className = "x-font3">1 month: 1% return</span>
                        </div>
                        <div>
                            <Radio
                                checked={step=="3"}
                                onChange={(e)=>handleStep(e,"3")}
                                name="radio-button-demo"
                                color = "primary"
                                inputProps={{ 'aria-label': 'A' }}
                            />
                            <span className = "x-font3">3 month: 3% return</span>
                        </div>
                        <div>
                            <Radio
                                checked={step=="10"}
                                onChange={(e)=>handleStep(e,"10")}
                                name="radio-button-demo"
                                color = "primary"
                                inputProps={{ 'aria-label': 'A' }}
                            />
                            <span className = "x-font3">6 month: 10% return</span>
                        </div>
                        <div>
                            <Radio
                                checked={step=="20"}
                                onChange={(e)=>handleStep(e,"20")}
                                name="radio-button-demo"
                                color = "primary"
                                inputProps={{ 'aria-label': 'A' }}
                            />
                            <span className = "x-font3">1 Year: 20% return</span>
                        </div>
                        </Grid>
                        <Grid item xs = {1} sm = {2} md = {3}></Grid>
                    </Grid>
                    <div className = "x-font2 text-center mt-4">
                        {`${returnValue} atari will be returned!`}
                    </div>
                    <div className = "mt-5">
                        <button className = "x-swapCard-submit-button" onClick = {handleStake}>{loadingStake?<img src = "/img/loading.gif" />:"Stake"}</button>
                    </div>
                </div>):
                (
                    <div>
                        <div className = "x-font2 text-center">
                            {`you will receive ${stakeState} in ${lockTime} exactly!`}
                        </div>
                        <div className = "mt-5">
                            <button className = "x-swapCard-submit-button" onClick = {handleWithdraw}>{loadingWithdraw?<img src = "/img/loading.gif" />:"withdraw"}</button>
                        </div>
                    </div>
                )
            }
        </div>
    )
}

export default StakeCard;