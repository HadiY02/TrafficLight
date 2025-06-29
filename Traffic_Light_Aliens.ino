#include <ESP8266WiFi.h>
#include <WiFiClient.h>
#include <ESP8266WebServer.h>
#include <ESP8266mDNS.h>
#include <LittleFS.h> 
#define SPIFFS LittleFS

const char* ssid = "HY";
const char* password = "hadi1234";

const int greenLED = 2;
const int yellowLED = 0;
const int redLED = 4;
ESP8266WebServer server(80);

void setup() {
  Serial.begin(115200);

  pinMode(greenLED, OUTPUT);
  pinMode(yellowLED, OUTPUT);
  pinMode(redLED, OUTPUT);


  digitalWrite(greenLED, HIGH);
  digitalWrite(yellowLED, HIGH);
  digitalWrite(redLED, HIGH); 

  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print(".");
  }
  Serial.println("\nConnected!");
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());

  server.on("/greenon", []() {
    digitalWrite(greenLED, LOW);  
    server.send(200, "text/plain", "Green LED is ON");
  });

  server.on("/greenoff", []() {
    digitalWrite(greenLED, HIGH); 
    server.send(200, "text/plain", "Green LED is OFF");
  });


  server.on("/yellowon", []() {
    digitalWrite(yellowLED, LOW); 
    server.send(200, "text/plain", "Yellow LED is ON");
  });

  server.on("/yellowoff", []() {
    digitalWrite(yellowLED, HIGH); 
    server.send(200, "text/plain", "Yellow LED is OFF");
  });


  server.on("/redon", []() {
    digitalWrite(redLED, LOW); 
    server.send(200, "text/plain", "Red LED is ON");
  });

  server.on("/redoff", []() {
    digitalWrite(redLED, HIGH); 
    server.send(200, "text/plain", "Red LED is OFF");
  });
  server.onNotFound([]() {
    server.send(404, "text/plain", "Error");
  });
  server.begin(); 
  Serial.println("Server active");

  server.enableCORS(true); 
}
void loop() {
  server.handleClient();
}