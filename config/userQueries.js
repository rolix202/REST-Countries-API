import { query } from "./dbQuery.js"

export const getAllUsernames = async () => {
    const result = await query("SELECT * FROM usernames;", [])
    return result.rows
}