import sql from "@/connections/psql";

type ExistingUserType = {
  username: string;
  id: string;
  auth_service: "native" | "discord" | "github" | "google";
  auth_service_user_id: string | null;
  admin: boolean;
  premium: number;
  created_at: Date;
  pfp_url: string;
}

export class Users {
  public async create({
    username,
    authService,
    authServiceUserId,
    passhash,
    pfpUrl
  }: {
    username: string;
    authService: "native" | "google" | "discord" | "github";
    authServiceUserId: string;
    pfpUrl?: string;
    passhash?: string;
  }) {
    const client = sql;

    try {
      await client.query("BEGIN");

      const userCheck = await client.query(
        `SELECT 1 FROM users WHERE username = $1`,
        [username]
      );
      if (userCheck.rowCount !== 0) {
        await client.query("ROLLBACK");
        return { success: false, message: "Username already exists" };
      }

      if (authService === "native" && !passhash) {
        await client.query("ROLLBACK");
        return { success: false, message: "Password hash is required for native auth service" };
      }

      let userId: bigint;
      let isUnique = false;
      while (!isUnique) {
        userId = BigInt(
          Math.floor(10_000_000_000_000_000 + Math.random() * 9_000_000_000_000_000)
        );

        const idCheck = await client.query(`SELECT 1 FROM users WHERE id = $1`, [
          userId,
        ]);
        if (idCheck.rowCount === 0) isUnique = true;
      }

      await client.query(
        `INSERT INTO users (id, username, auth_service, auth_service_user_id, passhash, pfp_url) 
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [userId!, username, authService, authServiceUserId, authService === "native" ? passhash : null, pfpUrl ? pfpUrl: "/cdn/images/pfp/initials.png"]
      );

      await client.query("COMMIT");

      return { success: true, userid: (userId!.toString()) };

    } catch (error) {
      await client.query("ROLLBACK");

      console.error("Error creating user:", error);
      return { success: false, message: "Error creating user" };
    }
  }
}

export class ExistingUser {
  username: string;
  id: string;
  auth_service: "native" | "discord" | "github" | "google";
  auth_service_user_id: string | null;
  admin: boolean;
  premium: number;
  created_at: Date;
  pfp_url: string;


  private constructor(data: ExistingUserType) {
    this.id = data.id;
    this.username = data.username;
    this.auth_service = data.auth_service
    this.auth_service_user_id = data.auth_service_user_id
    this.admin = data.admin
    this.premium = data.premium
    this.created_at = data.created_at
    this.pfp_url = data.pfp_url
  }

  static async fetch(userid: string): Promise<ExistingUser | null> {
    try {
      const { rows } = await sql.query(`SELECT * FROM users WHERE id = $1`, [userid]);
      if (rows.length === 0) return null;

      return new ExistingUser(rows[0]); // Now this works correctly!
    } catch (error) {
      console.error("Database error:", error);
      return null;
    }
  }
  public async rename(newName: string): Promise<{ oldName: string; newName: string }> {
    if (!this.id) return { oldName: this.username, newName: this.username };
    if (newName === this.username) return { oldName: this.username, newName };

    const isValidUsername = /^[a-zA-Z0-9._@-]{3,32}$/.test(newName);
    if (!isValidUsername) return { oldName: this.username, newName: this.username };

    try {
      const { rowCount } = await sql.query(
        `SELECT id FROM users WHERE username = $1`,
        [newName]
      );
      if (rowCount! > 0) return { oldName: this.username, newName: this.username };

      await sql.query(
        `UPDATE users SET username = $1 WHERE id = $2`,
        [newName, this.id]
      );

      this.username = newName;
      return { oldName: this.username, newName };
    } catch (error) {
      console.error("Error renaming user:", error);
      return { oldName: this.username, newName: this.username };
    }
  }

}

