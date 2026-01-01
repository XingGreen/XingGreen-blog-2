import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function POST({ request }) {
  try {
    const data = await request.json();
    
    const { title, category, date, description, tags, image, content, published } = data;
    
    if (!title || !content) {
      return new Response(
        JSON.stringify({ success: false, message: '标题和内容不能为空' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const slug = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
    
    const publishDate = date || new Date().toISOString().split('T')[0];
    
    const tagsArray = Array.isArray(tags) ? tags : (tags ? tags.split(',').map(tag => tag.trim()) : []);
    
    const frontmatter = `---
title: "${title}"
description: "${description || ''}"
date: ${publishDate}
category: ${category || '未分类'}
tags: ${JSON.stringify(tagsArray)}
image: "${image || ''}"
published: ${published !== undefined ? published : true}
---

`;

    const contentDir = path.join(__dirname, '../../content/blog');
    
    if (!fs.existsSync(contentDir)) {
      fs.mkdirSync(contentDir, { recursive: true });
    }
    
    const filePath = path.join(contentDir, `${slug}.md`);
    
    if (fs.existsSync(filePath)) {
      return new Response(
        JSON.stringify({ success: false, message: '该标题的文章已存在' }),
        { status: 409, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    fs.writeFileSync(filePath, frontmatter + content, 'utf-8');
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: '文章创建成功',
        slug: slug 
      }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('创建文章时出错:', error);
    return new Response(
      JSON.stringify({ success: false, message: '服务器错误' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
