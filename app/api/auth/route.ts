import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { walletAddress, userData } = await request.json();

    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('onchain_address', walletAddress)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      throw fetchError;
    }

    if (existingUser) {
      // Update existing user
      const { data: updatedUser, error: updateError } = await supabase
        .from('users')
        .update({
          ...userData,
          last_login: new Date().toISOString(),
        })
        .eq('onchain_address', walletAddress)
        .select()
        .single();

      if (updateError) throw updateError;

      return NextResponse.json({
        success: true,
        user: updatedUser,
        isNewUser: false,
      });
    } else {
      // Create new user
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert({
          onchain_address: walletAddress,
          ...userData,
          created_at: new Date().toISOString(),
          last_login: new Date().toISOString(),
        })
        .select()
        .single();

      if (createError) throw createError;

      return NextResponse.json({
        success: true,
        user: newUser,
        isNewUser: true,
      });
    }
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const walletAddress = searchParams.get('address');

    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      );
    }

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('onchain_address', walletAddress)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    return NextResponse.json({
      success: true,
      user: user || null,
    });
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}
