package com.lela810.gibzmensa;

import androidx.appcompat.app.AppCompatActivity;

import android.annotation.SuppressLint;
import android.os.Bundle;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

public class MainActivity extends AppCompatActivity {

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        WebView webview = (WebView) findViewById(R.id.webview);

        webview.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                return false;
            }});

        WebSettings webSettings = webview.getSettings();
        webview.getSettings().setAppCacheEnabled(true);
        webview.getSettings().setDomStorageEnabled(true);
        webview.setWebChromeClient(new WebChromeClient());
        webSettings.setJavaScriptEnabled(true);
        webview.loadUrl("file:///android_asset/index.html");
    }
}