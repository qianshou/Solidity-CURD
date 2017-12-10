pragma solidity ^0.4.6;

contract UserCurd {
    struct UserStruct {
        string name;
        uint age;
    }
    mapping(uint => UserStruct) private UserStructs;
    uint[] private IdList;
    event InsertEvent(uint uid,string name,uint age);
    event UpdateEvent(uint uid,string name,uint age);
    event DeleteEvent(uint uid);
    //插入操作
    function insertUser(string name,uint age) public returns(uint uid){
        uint length = IdList.length;
        uint id;
        if(length == 0){
            id = 1;
        }else{
            uint lastId = IdList[length-1];
            id = lastId+1;
        }
        IdList.push(id);
        uid = IdList.length;
        UserStructs[id].name = name;
        UserStructs[id].age = age;
        InsertEvent(uid,name,age);  //插入成功，触发插入事件
        return uid;
    }
    //查询操作
    function getUser(uint uid) public view returns(uint retUid,string retName, uint retAge){
        require(isExist(uid) > -1);
        return (uid,UserStructs[uid].name,UserStructs[uid].age);
    }
    function getUidList() public view returns(uint[]){
        return IdList;
    }
    function isExist(uint uid) public view returns(int){
        if(IdList.length == 0) return -1;
        for(uint i=0;i<IdList.length;i++){
            if(IdList[i] == uid) return int(i);
        }
        return -1;
    }
    //更新操作
    function updateUser(uint uid,string name,uint age) public returns(bool){
        if(isExist(uid) < 0) return false;
        UserStructs[uid].name = name;
        UserStructs[uid].age = age;
        UpdateEvent(uid,name,age);  //更新成功，触发更新事件
        return true;
    }
    //删除操作
    function deleteUser(uint uid) public returns(bool){
        int index = isExist(uid);
        if(index < 0) return false;
        delete UserStructs[uid];
        for(uint i= uint(index);i<IdList.length-1;i++){
            IdList[i] = IdList[i+1];
        }
        IdList.length--;
        DeleteEvent(uid); //删除成功，触发更新事件
        return true;
    }
}