---
# 主题列表：juejin, github, smartblue, cyanosis, channing-cyan, fancy, hydrogen, condensed-night-purple, greenwillow, v-green
theme: v-green
highlight:
---

## Submission Details
Name: Jiaming Nie
e-mail: jiaming.nie13@gmail.com

## Modules and Structure

### Modules:
`NestJS`
`ioredis`
`nestjs-redis`
`kafka-node`
`typeorm`

### Structure

On the backend, there are 3 services in use:

1. Order service - used to generate order
2. Inventory Service - used in High concurrency situation, use Redis and Kafka 
3. WeChatAPI token - Generated and update token 



## Architecture 

In situations of high concurrency, this architecture proves to be extremely effective due to its key advantages:

1. **Concurrent Processing Capability:** Utilizing Redis as the inventory database facilitates swift read and write operations, ensuring efficient handling of concurrent requests from multiple users.

2. **Optimistic Locking Mechanism:** Redis's optimistic locking prevents data inconsistency when multiple users access and modify inventory simultaneously within the `InventoryService`.

3. **Transaction Support:** The `InventoryService` employs Redis transactions (using multi/exec commands) to ensure atomic inventory decrement and order creation, maintaining data consistency.

4. **Message Queuing:** Kafka's role as a message queue decouples order creation from seckill logic, enhancing system flexibility and scalability for asynchronous processing of high message volumes.

5. **Distributed Architecture:** Redis and Kafka's distributed features accommodate a higher number of requests by distributing load across servers. Redis acts as a rapid cache, Kafka handles message distribution and processing scalability.

In summary, this architecture optimally leverages Redis and Kafka's strengths, ensuring efficient inventory and seckill logic management in high-concurrency scenarios while guaranteeing system stability and reliability.