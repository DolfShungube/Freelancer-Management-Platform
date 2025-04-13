import supabase from "./superbaseClient.js";

    window.addEventListener('load', async () => {
        const { data: { session } } = await supabase.auth.getSession();      
        if (!session) {
            window.location.href = "../../../index.html";
        }
    });
    