const express=require('express')
const bookRoute=require('./routes/books.route')
const app=express();

app.use(express.json());
app.use('/api/books',bookRoute);

const PORT=9000;

app.listen(PORT,()=>{
    console.log('Listening on port :'+PORT);
})