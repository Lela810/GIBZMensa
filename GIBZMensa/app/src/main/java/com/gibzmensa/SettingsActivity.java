package com.gibzmensa;


import android.content.Context;
import android.os.AsyncTask;
import android.os.Bundle;
import android.util.JsonReader;
import android.widget.TextView;

import androidx.appcompat.app.ActionBar;
import androidx.appcompat.app.AppCompatActivity;
import androidx.preference.PreferenceFragmentCompat;

import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.URL;

import javax.net.ssl.HttpsURLConnection;


public class SettingsActivity extends AppCompatActivity {


    private class apicall extends AsyncTask<Void, Void, Void> {

        // Create URL
        URL apiEndpoint = new URL("https://GIBZMensa.lklaus.ch/api/v1/");

        // Create connection
        HttpsURLConnection myConnection = (HttpsURLConnection) apiEndpoint.openConnection();

        myConnection.setRequestProperty("User-Agent", "my-rest-app-v0.1");

        InputStream responseBody = myConnection.getInputStream();
        InputStreamReader responseBodyReader =
                new InputStreamReader(responseBody, "UTF-8");

        JsonReader jsonReader = new JsonReader(responseBodyReader);
        myConnection.disconnect();


        private apicall() throws IOException {
        }

        @Override
        protected Void doInBackground(Void... voids) {
            return null;
        }
    }



    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.settings_activity);
        if (savedInstanceState == null) {
            getSupportFragmentManager()
                    .beginTransaction()
                    .replace(R.id.settings, new SettingsFragment())
                    .commit();
        }
    }

    public static class SettingsFragment extends PreferenceFragmentCompat {
        @Override
        public void onCreatePreferences(Bundle savedInstanceState, String rootKey) {
            setPreferencesFromResource(R.xml.root_preferences, rootKey);
        }
    }

}


