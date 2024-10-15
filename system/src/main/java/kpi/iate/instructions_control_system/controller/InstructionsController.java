package kpi.iate.instructions_control_system.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import kpi.iate.instructions_control_system.dto.InstructionsDto;
import kpi.iate.instructions_control_system.enums.InstructionStatus;
import kpi.iate.instructions_control_system.service.InstructionsService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
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
    @Operation(summary = "get instruction using it`s title")
    @GetMapping("/get/{instructionTitle}")
    public InstructionsDto getInstructionByTitle(@RequestHeader(value = "key") UUID key, @PathVariable String instructionTitle){
        return instructionsService.getInstructionByTitle(key, instructionTitle);
    }
    @Operation(summary = "get all instructions")
    @GetMapping("/get/all")
    public List<InstructionsDto> getAllInstructions(@RequestHeader(value = "key") UUID key){
        return instructionsService.getAllInstructions(key);
    }

//    @Operation(summary = "get all instructions for one head")
//    @GetMapping("/get/filteredByHeadSurname/{headSurname}")
//    public List<InstructionsDto> getInstructionsFilteredByHeadSurname(@RequestHeader(value = "key") UUID key, @PathVariable String headSurname){
//        return instructionsService.getInstructionsFilteredByHeadSurname(key, headSurname);
//    }

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
    @PostMapping("/update")
    public void updateInstruction(@RequestHeader(value = "key") UUID key,
                                  @Parameter(description = "Instruction details")
                                  @RequestBody InstructionsDto instructionsDto) {
        instructionsService.updateInstruction(key, instructionsDto);
    }

//    @Operation(summary = "create instruction passing all fields.")
//    @PostMapping("/new/{newTitle}/{newHeadSurname}/{newHeadName}/{newHeadPatronymic}/{headControlSurname}/{headControlName}/{headControlPatronymic}/{status}/{sourceOfInstruction}/{newShortDescription}/{newFullDescription}/{newText}/{newStartTime}/{newExpTime}")
//    public InstructionsDto createInstruction(@RequestHeader(value = "key") UUID key, @PathVariable final String newTitle,
//                                             @PathVariable final String newHeadSurname, @PathVariable final String newHeadName, @PathVariable final String newHeadPatronymic,
//                                             @PathVariable final String headControlSurname, @PathVariable final String headControlName, @PathVariable final String headControlPatronymic,
//                                             @PathVariable final String status, @PathVariable final String sourceOfInstruction,
//                                             @PathVariable final String newShortDescription, @PathVariable final String newFullDescription, @PathVariable final String newText,
//                                             @PathVariable final String newStartTime, @PathVariable final String newExpTime){
//        return instructionsService.createInstruction(key, newTitle, newHeadSurname, newHeadName, newHeadPatronymic, headControlSurname, headControlName, headControlPatronymic, status, sourceOfInstruction, newShortDescription, newFullDescription, newText, newStartTime, newExpTime);
//    }

//    @Operation(summary = "create instruction passing all fields.")
//    @PostMapping("/new/{newTitle}/{newHeadSurname}/{newHeadName}/{newHeadPatronymic}/{headControlSurname}/{headControlName}/{headControlPatronymic}/{status}/{sourceOfInstruction}/{newShortDescription}/{newFullDescription}/{newText}/{newStartTime}/{newExpTime}")
//    public InstructionsDto createInstruction(@RequestHeader(value = "key") UUID key, @RequestBody InstructionsDto instructionsDto, @RequestHeader String userId){
//        return instructionsService.createInstruction(key, userId, instructionsDto);
//    }

//    @Operation(summary = "update instruction passing all fields.")
//    @PostMapping("/update/{instructionTitle}/{newTitle}/{newHeadSurname}/{newHeadName}/{newHeadPatronymic}/{headControlSurname}/{headControlName}/{headControlPatronymic}/{status}/{sourceOfInstruction}/{newShortDescription}/{newFullDescription}/{newText}/{newStartTime}/{newExpTime}")
//    public InstructionsDto updateInstructionByTitle(@RequestHeader(value = "key") UUID key, @PathVariable final String instructionTitle, @PathVariable final String newTitle,
//                                                    @PathVariable final String newHeadSurname, @PathVariable final String newHeadName, @PathVariable final String newHeadPatronymic,
//                                                    @PathVariable final String headControlSurname, @PathVariable final String headControlName, @PathVariable final String headControlPatronymic,
//                                                    @PathVariable final String status, @PathVariable final String sourceOfInstruction,
//                                                    @PathVariable final String newShortDescription, @PathVariable final String newFullDescription, @PathVariable final String newText,
//                                                    @PathVariable final String newStartTime, @PathVariable final String newExpTime){
//        return instructionsService.updateInstructionByTitle(key, instructionTitle, newTitle, newHeadSurname, newHeadName, newHeadPatronymic, headControlSurname, headControlName, headControlPatronymic, status, sourceOfInstruction, newShortDescription, newFullDescription, newText, newStartTime, newExpTime);
//    }


    @Operation(summary = "delete instruction by title")
    @PostMapping("/{instructionTitle}")
    public void deleteInstructionByTitle(@RequestHeader(value = "key") UUID key, @PathVariable String instructionTitle) {
        instructionsService.deleteInstructionByTitle(key, instructionTitle);
    }
    @Operation(summary = "create instruction passing all fields via dtooo.")
    @PostMapping("/new/processing")
    public InstructionsDto createInstructionViaDTOO(@RequestHeader(value = "key") UUID key,
                                                    @Parameter(description = "Instruction details")
                                                    @RequestBody InstructionsDto instructionsDto, Model model) {
        model.addAttribute("isGuestUser", false);
        return instructionsService.createInstruction(key, instructionsDto);
    }

    //todo update instr status by id/title (by enum)
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
}
