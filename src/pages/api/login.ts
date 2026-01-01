export async function POST({ request }) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return new Response(
        JSON.stringify({ success: false, message: '用户名和密码不能为空' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (username === 'admin' && password === 'admin123') {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: '登录成功',
          username: username 
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: false, message: '用户名或密码错误' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: '服务器错误' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
