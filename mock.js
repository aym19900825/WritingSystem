//引入mock.js文件
const Mock = require('mockjs');
//获取mock.random对象
const Random = Mock.Random;

const relationTxt = function() {
    let content = Random.csentence(5, 30);
    return {
        content: content
    }
}

// Mock.mock( url, post/get , 返回的数据)；
Mock.mock('/api/relationContent', 'get', relationTxt);