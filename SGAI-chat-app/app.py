from fastapi import FastAPI, Request, Form
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from starlette.middleware.sessions import SessionMiddleware
from starlette.status import HTTP_303_SEE_OTHER
from pydantic import BaseModel
from openai import OpenAI


app = FastAPI()

# 挂载静态资源
app.mount("/static", StaticFiles(directory="static"), name="static")

# 设置模板目录
templates = Jinja2Templates(directory="templates")

# 添加 Session 中间件（用于存储 API）
app.add_middleware(SessionMiddleware, secret_key="your-secret-key")


# api请求体
class APIRequest(BaseModel):
    api: str

# chat 请求体
class ChatRequest(BaseModel):
    input: str




# 首页展示
@app.get("/", response_class=HTMLResponse)
async def read_root(request: Request):

    return templates.TemplateResponse("index_test4_RAG.html", {
        "request": request,
    })


@app.post("/submit-api")
async def receive_api(request: Request, body: APIRequest):
    print("收到前端的 API:", body.api)

    # 通过 request.session 访问 session
    request.session["api_key"] = body.api

    return {"message": "接收成功", "received_api": body.api}



@app.post("/chat")
async def chat_endpoint(request: Request,chat: ChatRequest):
    api_key = request.session.get("api_key")
    print("用户输入:", chat.input)


    # # deepseek api
    # print("api",api_key)
    client = OpenAI(
        api_key=api_key,
        base_url="https://api.deepseek.com"  # DeepSeek 的 URL
    )


    try:
        response = client.chat.completions.create(
            model="deepseek-chat",
            messages=[
                {"role": "system", "content": "你是一个人工智能助手"},
                {"role": "user", "content": chat.input},
            ],
            stream=False
        )
        reply = response.choices[0].message.content.strip()
        # print("模型回复:", reply)
        return {"reply": reply}

        # print("模型回复",chat.input)
        # return {"reply": chat.input}

    except Exception as e:
        print("调用模型出错：", e)
        return {"reply": "⚠️ 模型请求失败，请检查 API Key 或网络状态"}


