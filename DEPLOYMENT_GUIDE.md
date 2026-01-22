# 部署指南 - 第一步：应用数据库迁移

## ⚠️ 重要：在部署前必须完成此步骤

### 步骤 1：应用 Supabase 数据库迁移

1. **打开 Supabase Dashboard**
   - 访问：https://supabase.com/dashboard
   - 选择项目：`dghgfkgaznqqzdgyvrai`

2. **进入 SQL Editor**
   - 左侧菜单选择 "SQL Editor"
   - 点击 "New Query"

3. **运行迁移脚本**
   - 打开文件：`supabase/migrations/003_aristutor_full_schema.sql`
   - 复制全部内容
   - 粘贴到 SQL Editor
   - 点击 "Run" 执行

4. **验证表已创建**
   检查以下表是否已创建（Table Editor > 查看表）：
   - ✅ subjects
   - ✅ user_subjects
   - ✅ credit_transactions
   - ✅ credit_holds
   - ✅ credit_packages
   - ✅ tutor_pricing
   - ✅ tutor_availability
   - ✅ tutor_stats
   - ✅ session_participants
   - ✅ session_requests
   - ✅ ratings
   - ✅ questions
   - ✅ answers
   - ✅ notes
   - ✅ note_purchases
   - ✅ study_buddy_profiles
   - ✅ study_buddy_matches
   - ✅ accountability_programs
   - ✅ accountability_checkins
   - ✅ conversations
   - ✅ conversation_participants
   - ✅ messages
   - ✅ reports
   - ✅ notifications

### 步骤 2：创建 Storage Buckets

1. **进入 Storage**
   - Supabase Dashboard > Storage
   - 点击 "Create a new bucket"

2. **创建以下 buckets：**

   **Bucket 1: verification-documents**
   - Name: `verification-documents`
   - Public: ✅ (启用)
   - Allowed MIME types: `image/jpeg, image/png, application/pdf`
   - Max file size: 10 MB
   
   **Bucket 2: session-recordings**
   - Name: `session-recordings`
   - Public: ❌ (禁用 - 仅参与者可访问)
   - Allowed MIME types: `video/webm, video/mp4`
   - Max file size: 500 MB
   
   **Bucket 3: notes-files**
   - Name: `notes-files`
   - Public: ✅ (启用)
   - Allowed MIME types: `application/pdf, image/jpeg, image/png`
   - Max file size: 50 MB
   
   **Bucket 4: avatars**
   - Name: `avatars`
   - Public: ✅ (启用)
   - Allowed MIME types: `image/jpeg, image/png, image/webp`
   - Max file size: 5 MB

3. **设置 Storage 策略（RLS）**

   对于 `verification-documents` bucket，在 Policies 中添加：
   ```sql
   -- Allow authenticated users to upload their own documents
   CREATE POLICY "Users can upload own verification docs"
   ON storage.objects FOR INSERT
   TO authenticated
   WITH CHECK (bucket_id = 'verification-documents' AND (storage.foldername(name))[1] = auth.uid()::text);

   -- Allow users to read their own documents
   CREATE POLICY "Users can read own verification docs"
   ON storage.objects FOR SELECT
   TO authenticated
   USING (bucket_id = 'verification-documents' AND (storage.foldername(name))[1] = auth.uid()::text);
   ```

   对于 `avatars` bucket：
   ```sql
   -- Allow authenticated users to upload their avatar
   CREATE POLICY "Users can upload own avatar"
   ON storage.objects FOR INSERT
   TO authenticated
   WITH CHECK (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

   -- Allow everyone to view avatars
   CREATE POLICY "Avatars are publicly accessible"
   ON storage.objects FOR SELECT
   TO public
   USING (bucket_id = 'avatars');
   ```

### 步骤 3：验证迁移成功

运行以下 SQL 查询验证：

```sql
-- 检查 subjects 表是否有数据
SELECT COUNT(*) FROM subjects;
-- 应该返回 10 个默认科目

-- 检查 credit_packages 表
SELECT * FROM credit_packages;
-- 应该返回 5 个信用包

-- 检查 RLS 策略
SELECT schemaname, tablename, policyname
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

### ✅ 完成后

数据库迁移完成！现在可以继续下一步：配置环境变量和部署。

---

**注意：** 如果迁移过程中遇到错误，请检查：
1. 是否有权限执行 SQL
2. 表名是否已存在（如果是，需要先删除旧表）
3. 查看 Supabase Logs 获取详细错误信息
