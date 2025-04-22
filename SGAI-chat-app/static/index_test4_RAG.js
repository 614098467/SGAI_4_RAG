
// 提交api
console.log("JS loaded!");


const apiForm = document.querySelector('.form-apiform');
const apiInput = document.querySelector('.textarea-apitext');
const apiValueDisplay = document.querySelector('#current-api-value');

const userinputForm = document.querySelector('.form-userinput');
const userInput = document.querySelector('.textarea-userinput');
const chatMessages = document.getElementById('chat-messages');


document.addEventListener("DOMContentLoaded", function () {
    // 每次页面加载清空 localStorage 中的 api 项
    localStorage.removeItem('api');



    //监听键盘提交
    apiForm.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault(); // 阻止默认换行行为
            apiForm.dispatchEvent(new Event('submit')); // 手动触发表单提交事件
        }
    });

    // 监听api提交
    apiForm.addEventListener('submit', function (e) {
        e.preventDefault();


        const api = apiInput.value.trim();
        
        // 判断
        if (!api) {
            alert("API 不能为空");
            return;
        }

        // 储存本地
        localStorage.setItem('api', api);
        apiValueDisplay.textContent = api;

        // 如果存在就发给后端
        fetch('/submit-api',{
            method:'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body:JSON.stringify({api:api})
        })


        .then(response => {
            if (!response.ok) {
                throw new Error('网络响应失败');
            }
            return response.json(); // 如果后端返回的是 JSON
        })

        .then(data => {
            console.log('后端返回的数据:', data);
            // 你可以根据后端返回的内容做进一步处理
        })

        .catch(error => {
            console.error('发送请求失败:', error);
        });

    });


    // 键盘检测
    userinputForm.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault(); // 阻止默认换行行为
            userinputForm.dispatchEvent(new Event('submit')); // 手动触发表单提交事件
        }
    });



    // 监听submit事件
    userinputForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const input = userInput.value.trim();

        if (!input) {
            alert("用户输入为空！");
            return;
        }

        if (!localStorage.getItem('api')) {
            alert("未绑定 API，请先输入 API");
            return;
        }

        addMessage("user", input);
        userInput.value = "";

        showLoading();  
            // 发送到后端
        fetch('/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({input: input})
        })

        .then(response => {
            if (!response.ok) {
                throw new Error('后端响应失败');
            }
            return response.json();
        })
        .then(data => {
            console.log('后端返回结果:', data);
            // TODO: 在页面中显示 data.reply（假设后端返回 {reply: "..."}）
            hideLoading();
            addMessage("bot", data.reply);
        })
        .catch(error => {
            console.error('发送失败:', error);
            hideLoading();
            alert("发送失败，请检查网络或后端接口。");
        });
        // 这里可以处理用户输入的逻辑
        console.log("用户输入已提交:", input);
    });
});



function addMessage(sender, message) {
    const wrapper = document.createElement('div');
    wrapper.classList.add('chat-message', sender === "user" ? 'user-message' : 'bot-message');

    const avatar = document.createElement('img');
    avatar.classList.add('avatar');
    avatar.src = sender === "user" ? "/static/user-avatar.png" : "/static/bot-avatar.png";
    avatar.alt = sender;

    const messageBubble = document.createElement('div');
    messageBubble.classList.add('message-bubble');
    messageBubble.textContent = message;

    // 用户在右边（头像在右），AI 在左边（头像在左）
    if (sender === "user") {
        wrapper.appendChild(messageBubble);
        wrapper.appendChild(avatar);
    } else {
        wrapper.appendChild(avatar);
        wrapper.appendChild(messageBubble);
    }

    chatMessages.appendChild(wrapper);
    chatMessages.scrollTop = chatMessages.scrollHeight;
};



function showLoading() {
    const loadingDiv = document.createElement('div');
    loadingDiv.id = 'loading';
    loadingDiv.className = 'chat-message bot-message loading-dots';
    loadingDiv.innerHTML = '<span>.</span><span>.</span><span>.</span>';
    chatMessages.appendChild(loadingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function hideLoading() {
    const loadingDiv = document.getElementById('loading');
    if (loadingDiv) {
        loadingDiv.remove();
    }
}