/**
 * Created by zhezhao on 2017/12/8.
 */
let Web3 = require("web3");
let fs = require("fs");
let web3 = new Web3();
web3.setProvider(new Web3.providers.HttpProvider("http://192.168.1.11:8545"));
let address = "0x61C64CE900236575F2212D7346c12BE9d1e9002d";
let abi = JSON.parse(fs.readFileSync("./solidity/UserCurd.abi").toString("utf8"));
let MyContract = web3.eth.contract(abi);
let contractInstance = MyContract.at(address);
//查询用户
function  listUser() {
    let list = contractInstance.getUidList();
    let uids = [];
    for(let obj of list){
        uids.push(obj.c[0]);
    }
    let userList = [];
    for(let uid of uids){
        let res = contractInstance.getUser(uid);
        let name = res[1].replace(/"/g,'');
        let age = res[2].c[0];
        userList.push({
            uid : uid,
            name : name,
            age : age
        });
    }
    console.log("User List:");
    console.log(userList);
}

//添加用户
function insertUser(name,age) {
    name = name || "default";
    age = age || 1;
    let coinbase = "0x8a1C505f1ff14045c03622E9ab82EB19c730cef3";
    web3.personal.unlockAccount(coinbase, "coinbase", 500);
    contractInstance.insertUser(name,age, {from: coinbase, gas: 1000000});
    let myEvent = contractInstance.InsertEvent();
    myEvent.watch(function (err,result) {
        if(err){
            console.log("Insert Error:");
            console.log(err);
        }else{
           console.log(result);
           listUser();
        }
    })
}

//删除用户
function deleteUser(uid) {
    uid = parseInt(uid);
    if(uid <= 0) return false;
    let coinbase = "0x8a1C505f1ff14045c03622E9ab82EB19c730cef3";
    web3.personal.unlockAccount(coinbase, "coinbase", 500);
    contractInstance.deleteUser(uid, {from: coinbase, gas: 1000000});
    let myEvent = contractInstance.DeleteEvent();
    myEvent.watch(function (err,result) {
        if(err){
            console.log("Delete Error:");
            console.log(err);
        }else{
            console.log(result);
            listUser();
        }
    })
}

//修改用户
function updateUser(uid,name,age) {
    uid = parseInt(uid);
    name = name || "default";
    age = age || 1;
    if(uid <= 0) return false;
    let coinbase = "0x8a1C505f1ff14045c03622E9ab82EB19c730cef3";
    web3.personal.unlockAccount(coinbase, "coinbase", 500);
    contractInstance.updateUser(uid,name,age, {from: coinbase, gas: 1000000});
    let myEvent = contractInstance.UpdateEvent();
    myEvent.watch(function (err,result) {
        if(err){
            console.log("Update Error:");
            console.log(err);
        }else{
            console.log(result);
            listUser();
        }
    })
}

//insertUser("one",101);
//updateUser(1,"one",11);
deleteUser(1);