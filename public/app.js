const firebaseConfig = {
  apiKey: "AIzaSyCfNoweL8v2dc1UaQOPfKVQbnqkJdplrvk",
  authDomain: "fir-chat-app-61221.firebaseapp.com",
  projectId: "fir-chat-app-61221",
  storageBucket: "fir-chat-app-61221.appspot.com",
  messagingSenderId: "877157606244",
  appId: "1:877157606244:web:76a4bd8427f441e46f9071"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const chat = document.querySelector(".chat");
const send = document.querySelector(".input button");
const messageInput = document.querySelector(".input input");
let username;


// getting username
if(localStorage.getItem("userName") == null){
  username = prompt("Set username:");
  console.log(username);
  localStorage.setItem("userName", username);
}else{
  username = localStorage.getItem("userName");
}
function change(){
  username = prompt("Set username:");
  localStorage.setItem("userName", username);
  location.reload();
}







//collecting messages from firestore on every change
let messageBox = [];
db.collection("message").orderBy("time").onSnapshot((querySnapshot) => {
  messageBox = [];
  querySnapshot.forEach((doc) => {
    messageBox.push([doc.data().name, doc.data().text]);
  });
  loadChat(messageBox);
});

//rendering messages to the dom
function loadChat(box){
  chat.innerHTML = "";
  
  for(let i = 0; i < box.length; i++){
    let className = username === box[i][0] ? "myMess" : "messageItem";
    chat.innerHTML += `
      <div class="${className} message-container">
        <span>${box[i][0]}</span>
        <div>
          <p>${box[i][1]}</p>
        </div>
      </div>
    `;
  }
  chat.scrollTop = chat.scrollHeight;
}


// sending message
send.onclick = function(){
  let mess = messageInput.value;
  messageInput.value = "";
  let time = new Date();
  let doc = {
    text: mess,
    time: time,
    name: username
  }
  db.collection("message").add(doc).then(console.log("message sent"));
}
//enter press while typing clicks send button ⬆
messageInput.addEventListener("keyup", function(event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    send.click();
  }
});