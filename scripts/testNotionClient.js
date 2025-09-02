import { Client } from '@notionhq/client';
import dotenv from 'dotenv';

dotenv.config();

const notion = new Client({ auth: process.env.NOTION_API_SECRET });

const databaseId = process.env.DATABASE_ID;
console.log(databaseId);

const response = await notion.databases.query({
  database_id: databaseId,
});

console.log(response);