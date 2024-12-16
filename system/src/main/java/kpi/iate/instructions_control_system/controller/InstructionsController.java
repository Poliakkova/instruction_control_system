package kpi.iate.instructions_control_system.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import kpi.iate.instructions_control_system.dto.InstructionsDto;
import kpi.iate.instructions_control_system.enums.InstructionStatus;
import kpi.iate.instructions_control_system.service.InstructionsService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@CrossOrigin("*")
@RestController
@AllArgsConstructor
@RequestMapping("/instructions")
public class InstructionsController {

    private final InstructionsService instructionsService;

    @GetMapping("/key")
    public UUID getKey(){
        return instructionsService.getKey().getId();
    }
    @GetMapping("/statuses")
    public List<InstructionStatus> getPossibleStatuses() {
        return Arrays.stream(InstructionStatus.values()).collect(Collectors.toList());
    }
    @Operation(summary = "get instruction using it`s code")
    @GetMapping("/get/{instructionCode}")
    public InstructionsDto getInstructionByCode(@RequestHeader(value = "key") UUID key, @PathVariable String instructionCode){
        return instructionsService.getInstructionByCode(key, instructionCode);
    }
    @Operation(summary = "get all instructions")
    @GetMapping("/get/all")
    public List<InstructionsDto> getAllInstructions(@RequestHeader(value = "key") UUID key){
        return instructionsService.getAllInstructions(key);
    }

    @Operation(summary = "get all instructions after some start Date")
    @GetMapping("/get/filteredByStartDate/{startDate}")
    public List<InstructionsDto> getInstructionsFilteredByStartDate(@RequestHeader(value = "key") UUID key, @PathVariable String startDate){
        return instructionsService.getInstructionsFilteredByStartDate(key, startDate);
    }

    @Operation(summary = "get all instructions before some exp Date.")
    @GetMapping("/get/filteredByExpDate/{expDate}")
    public List<InstructionsDto> getInstructionsFilteredByExpDate(@RequestHeader(value = "key") UUID key, @PathVariable String expDate){
        return instructionsService.getInstructionsFilteredByExpDate(key, expDate);
    }

    @Operation(summary = "Update instruction")
    @PutMapping("/update")
    public void updateInstruction(@RequestHeader(value = "key") UUID key,
                                  @Parameter(description = "Instruction details")
                                  @RequestBody InstructionsDto instructionsDto) {
        instructionsService.updateInstruction(key, instructionsDto);
    }


    @Operation(summary = "delete instruction by code")
    @PostMapping("/{instructionCode}")
    public void deleteInstructionByCode(@RequestHeader(value = "key") UUID key, @PathVariable String instructionCode) {
        instructionsService.deleteInstructionByCode(key, instructionCode);
    }
    @Operation(summary = "create instruction passing all fields via dtooo.")
    @PostMapping("/new/processing")
    public InstructionsDto createInstructionViaDTOO(@RequestHeader(value = "key") UUID key,
                                                    @Parameter(description = "Instruction details")
                                                    @RequestBody InstructionsDto instructionsDto, Model model) {
        model.addAttribute("isGuestUser", false);
        return instructionsService.createInstruction(key, instructionsDto);
    }

    @Operation(summary = "Update instructions status")
    @PutMapping("/status/update")
    public void updateInstructionsStatus(@RequestHeader(value = "key") UUID key,
                                         @Parameter(description = "Instruction details")
                                         @RequestBody InstructionsDto instructionsDto) {
        instructionsService.updateInstructionStatus(key, instructionsDto);
    }

    @Operation(summary = "get archived instructions")
    @GetMapping("/archived")
    public List<InstructionsDto> getArchivedInstructions(@RequestHeader(value = "key") UUID key) {
        return instructionsService.getArchivedInstructions();
    }

    @Operation(summary = "send email")
    @PostMapping("/send-emails")
    public ResponseEntity<?> sendEmailToInstructionUsers(@RequestHeader(value = "key") UUID key,
                                                         @RequestBody InstructionsDto instructionsDto) {
        instructionsService.sendEmailToInstructionUsers(key, instructionsDto);
        return ResponseEntity.ok("Повідомлення успішно відправлено");
    }
}
