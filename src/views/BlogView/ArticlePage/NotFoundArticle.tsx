import React from 'react';
import { message } from 'antd';
import { Redirect } from 'web-router';

export default function NotFoundArticle() {
  message.warn('未找到目标文章');
  return <Redirect to="/blog" />;
}
