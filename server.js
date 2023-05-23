const express = require('express'); //라이브러리 참고
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended : true}));
app.set('view engine', 'ejs');

app.use('/piblic', express.static('public'));

//DB연결
var db;
const MongoClient = require('mongodb').MongoClient;
const uri = 'mongodb+srv://zxcvbnm7:zxcvbnm7@testdb.v7dd2oo.mongodb.net/?retryWrites=true&w=majority';

MongoClient.connect(uri, { useUnifiedTopology: true }, function(에러, client){

    if (에러) {return console.log(에러)}

    db = client.db('todoapp'); //폴더에 연결

    db.collection('post').insertOne( {이름 : 'John', _id : 100} , function(에러, 결과){
        console.log('저장완료');
    });

    app.listen(8080, function(){
        console.log('listening in 8080')

    }); // 서버    

});

app.get('/pet', function(요청, 응답){
    응답.send('펫용품을 쇼핑할 수 있는 페이지입니다.');
});

app.get('/beauty', function(요청, 응답){
    응답.send('뷰티페이지로 이동합니다.')
});

app.get('/', function(요청, 응답){
    응답.sendFile(__dirname + 'index.ejs')
});

app.get('/write', function(요청, 응답){
    응답.sendFile(__dirname + 'write.ejs')
});

app.post('/add', function(요청, 응답){
    응답.send('전송완료')
    db.collection('post').findOne({name : '개시물갯수'}, function(에러, 결과){
        console.log(결과.totalPost)
        var 개시물갯수 = 결과.totalPost;

        db.collection('post').insertOne( { _id : 개시물갯수 + 1, 제목 : 요청.body.title, 날짜 : 요청.body.date} , function(에러, 결과){
            console.log('저장완료'); 
            db.collection('post').updateOne({name : '개시물갯수'},{ $inc : {totalPost:1} },function(에러, 결과){
                if(에러) {return console.log(에러)}
            });
            //set 값을 바꿀떄 inc 더해줄값
        });

    });
    
});

app.get('/list', function(요청, 응답){
    db.collection('post').find().toArray(function(에러, 결과){
        console.log(결과);
        응답.render('list.ejs', {posts : 결과});
    });

});

app.delete('/delete', function(요청, 응답){
    console.log(요청.body)
    요청.body._id = parseInt(요청.body._id);
    db.collection('post').deleteOne(요청.body, function(에러, 결과){
        console.log('삭제완료');
        응답.status(200).send({ message : '성공했습니다.' });
    });
})

app.get('/detail/:id', function(요청, 응답){
    db.collection('post').findOne({_id : parseInt(요청.params.id)}, function(){
        console.log(결과);
        응답.render('detail.ejs', { data : 결과 });
    })
    
})



//MogoDB 데이터베이스 비번 zxcvbnm7