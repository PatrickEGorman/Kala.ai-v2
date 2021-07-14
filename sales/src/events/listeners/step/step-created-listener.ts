import {Message, Stan} from 'node-nats-streaming';
import {Listener, StepCreatedEvent, Subjects} from "@kala.ai/common";
import {queueGroupName} from "../queue-group-name";
import {Step} from "../../../models/Step";

export class StepCreatedListener extends Listener<StepCreatedEvent> {
    readonly subject = Subjects.StepCreated;
    queuedGroupName = queueGroupName;

    constructor(client: Stan) {
        super(client);
    };

    async onMessage(data: StepCreatedEvent['data'], msg: Message) {
        const {id, materialId, machineId, quantity, stepTime} = data;

        const step = Step.build({
            _id: id,
            machine: machineId,
            material: materialId,
            quantity,
            stepTime
        });
        await step.save();

        msg.ack();
        console.log(`Step ${step.id} added!`)

    }
}