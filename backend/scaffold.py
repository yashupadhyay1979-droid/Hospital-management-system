import os

base_dir = "c:/Users/yash upadhyay/OneDrive/Desktop/ASPATAL/backend/src/main/java/com/aspatal/hms"
packages = ["config", "model", "repository", "dto", "security", "service", "controller", "hl7"]

for pkg in packages:
    os.makedirs(os.path.join(base_dir, pkg), exist_ok=True)

# Main Class
main_class = """package com.aspatal.hms;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class HmsApplication {
    public static void main(String[] args) {
        SpringApplication.run(HmsApplication.class, args);
    }
}
"""

with open(os.path.join(base_dir, "HmsApplication.java"), "w") as f:
    f.write(main_class)

print("Directories and main class created.")
