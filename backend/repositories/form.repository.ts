import { isDbConnected, query } from '../config/database';
import { FormSubmission } from '../types';

let memorySubmissions: FormSubmission[] = [];

export class FormRepository {
  async submitForm(formId: number, dataJson: string, ipAddress?: string, userAgent?: string): Promise<FormSubmission> {
    const now = new Date().toISOString();
    if (isDbConnected()) {
      const sql = `
        INSERT INTO form_submissions (form_id, data_json, ip_address, user_agent, created_at)
        VALUES (?, ?, ?, ?, NOW())
      `;
      const res: any = await query(sql, [formId, dataJson, ipAddress || null, userAgent || null]);

      const inserted = await query<FormSubmission[]>(`SELECT * FROM form_submissions WHERE id = ? LIMIT 1`, [res.insertId]);
      return inserted[0];
    }

    const newSub: FormSubmission = {
      id: memorySubmissions.length + 1,
      form_id: formId,
      data_json: dataJson,
      ip_address: ipAddress,
      user_agent: userAgent,
      created_at: now,
    };
    memorySubmissions.push(newSub);
    return newSub;
  }

  async getSubmissionsByForm(formId: number): Promise<FormSubmission[]> {
    if (isDbConnected()) {
      const sql = `SELECT * FROM form_submissions WHERE form_id = ? ORDER BY id DESC`;
      return query<FormSubmission[]>(sql, [formId]);
    }
    return memorySubmissions.filter((s) => s.form_id === formId);
  }
}
