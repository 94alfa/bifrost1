import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();
    
    if (!username) {
      return NextResponse.json({ error: 'Nome de usuário é obrigatório' }, { status: 400 });
    }

    const adminUser = process.env.ADMIN_USERNAME || 'heindall';
    const adminPass = process.env.ADMIN_PASSWORD || 'pwd_baifrol';
    
    // Check if trying to login as admin
    if (username.trim().toLowerCase() === adminUser.toLowerCase()) {
      if (password === adminPass) {
        return NextResponse.json({
          success: true,
          username: adminUser,
          isAdmin: true
        });
      } else {
        return NextResponse.json({
          error: 'Senha de administrador incorreta.'
        }, { status: 401 });
      }
    }
    
    // For normal users, we just let them log in
    const formattedUser = username.trim().toLowerCase().replace(/\s+/g, '_');
    return NextResponse.json({
      success: true,
      username: formattedUser,
      isAdmin: false
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Erro ao realizar login' }, { status: 500 });
  }
}
