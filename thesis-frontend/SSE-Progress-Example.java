

@GetMapping(value = "/simulate/progress/{taskId}", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
public Flux<ServerSentEvent<SimulationProgress>> streamProgress(@PathVariable String taskId) {
    return simulationProgressService.getProgressStream(taskId)
        .map(progress -> ServerSentEvent.<SimulationProgress>builder()
            .id(String.valueOf(progress.getSequence()))
            .event("progress")
            .data(progress)
            .build());
}

@PostMapping("/simulate/with-plots-async")
public ResponseEntity<TaskResponse> runSimulationAsync(@RequestBody SimulationRequest request) {
    String taskId = UUID.randomUUID().toString();
    
    CompletableFuture.runAsync(() -> {
        simulationProgressService.updateProgress(taskId, 0, "Initializing simulation...");

        simulationProgressService.updateProgress(taskId, 10, "Creating data center...");

        simulationProgressService.updateProgress(taskId, 50, "Running MATLAB analysis...");

        simulationProgressService.updateProgress(taskId, 100, "Complete!");
    });
    
    return ResponseEntity.ok(new TaskResponse(taskId));
}
