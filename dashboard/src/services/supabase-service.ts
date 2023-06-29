import supabase from "../lib/supabaseClient";

export class SupabaseService {
  public static async getCredentialsByUserIdAndConnectorId(
    user_id: string,
    connector_id: number
  ): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from("credentials")
        .select("*")
        .eq("user_id", user_id)
        .eq("connector_id", connector_id)
        .single();

      if (error) {
        throw new Error(`Error fetching credentials: ${error.message}`);
      }

      return data.credential;
    } catch (error: any) {
      console.error(
        `Error in getCredentialsByUserIdAndConnectorId: ${error.message}`
      );
      return null;
    }
  }
}
