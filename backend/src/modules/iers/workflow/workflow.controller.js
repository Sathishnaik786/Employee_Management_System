const workflowService = require('./workflow.service');
const validator = require('./workflow.validator');

exports.createWorkflow = async (req, res, next) => {
    try {
        const { error, value } = validator.validateWorkflow(req.body);
        if (error) return res.status(400).json({ success: false, message: error.details[0].message });

        const data = await workflowService.createWorkflow(value, req.user);
        res.status(201).json({ success: true, data });
    } catch (err) {
        next(err);
    }
};

exports.addSteps = async (req, res, next) => {
    try {
        const { error, value } = validator.validateSteps(req.body);
        if (error) return res.status(400).json({ success: false, message: error.details[0].message });

        const data = await workflowService.addWorkflowSteps(req.params.id, value, req.user);
        res.status(201).json({ success: true, data });
    } catch (err) {
        next(err);
    }
};

exports.initiateWorkflow = async (req, res, next) => {
    try {
        const { error, value } = validator.validateInitiate(req.body);
        if (error) return res.status(400).json({ success: false, message: error.details[0].message });

        const data = await workflowService.initiateWorkflow(value.entity_type, value.entity_id, req.user);
        res.status(201).json({ success: true, data });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

exports.performAction = async (req, res, next) => {
    try {
        const { error, value } = validator.validateAction(req.body);
        if (error) return res.status(400).json({ success: false, message: error.details[0].message });

        await workflowService.performAction(req.params.instanceId, value, req.user);
        res.status(200).json({ success: true, message: `Action ${value.action} performed successfully` });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

exports.getInstance = async (req, res, next) => {
    try {
        const { supabaseAdmin } = require('@lib/supabase');
        const { data, error } = await supabaseAdmin
            .from('workflow_instances')
            .select('*, workflow:workflows(*), actions:workflow_actions(*)')
            .eq('id', req.params.instanceId)
            .single();

        if (error || !data) return res.status(404).json({ success: false, message: 'Instance not found' });
        res.status(200).json({ success: true, data });
    } catch (err) {
        next(err);
    }
};
exports.getPendingActions = async (req, res, next) => {
    try {
        const data = await workflowService.getPendingActions(req.user);
        res.status(200).json({ success: true, data });
    } catch (err) {
        next(err);
    }
};
