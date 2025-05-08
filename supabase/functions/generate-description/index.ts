// @ts-ignore
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
// @ts-ignore
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
    });
  }

  const { title, feature } = await req.json();

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

  // Create client to identify the user
  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: req.headers.get('Authorization')!,
      },
    },
  });

  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

  const user = (await supabase.auth.getUser()).data.user;

  if (!title || !feature) {
    return new Response(JSON.stringify({ error: 'Missing title or feature' }), {
      status: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
    });
  }

  // OpenAI prompt generation
  const prompt = `Write a compelling product description for a product titled "${title}" that has the key feature: ${feature}.`;

  const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    }),
  });

  const json = await openaiRes.json();
  const description = json.choices?.[0]?.message?.content || 'Failed to generate.';

  // Insert result into DB if user is authenticated
  if (user) {
    await supabaseAdmin.from('descriptions').insert([
      {
        user_id: user.id,
        title,
        feature,
        description,
      },
    ]);
  }

  return new Response(JSON.stringify({ description }), {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    },
  });
});
