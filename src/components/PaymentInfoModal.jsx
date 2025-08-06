import React, { useState, useEffect } from 'react';
import { Dialog } from '@/components/ui/dialog';
import { CreditCardIcon, PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const PaymentInfoModal = ({ 
  isOpen, 
  onClose, 
  onConfirmPayment, 
  totalAmount,
  isLoading = false 
}) => {
  const [paymentData, setPaymentData] = useState({
    numeroTransferencia: '',
    fechaPago: '',
    horaPago: '',
    bancoEmisor: '',
    comprobantePago: null
  });

  const [dragActive, setDragActive] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const bancos = [
    'Banco de Venezuela',
    'Banesco',
    'Mercantil',
    'Provincial',
    'Bicentenario',
    'Exterior',
    'Activo',
    'Caroní',
    'Plaza',
    'Sofitasa',
    'Otro'
  ];

  const handleInputChange = (field, value) => {
    setPaymentData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const compressImage = (file, maxWidth = 800, quality = 0.7) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        let { width, height } = img;
        
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(resolve, 'image/jpeg', quality);
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  const handleFileUpload = async (file) => {
    if (file && file.type.startsWith('image/')) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error('La imagen no debe superar los 10MB');
        return;
      }
      
      try {
        toast.loading('Procesando imagen...', { id: 'compress' });
        
        const compressedFile = await compressImage(file, 800, 0.8);
        const originalKB = (file.size / 1024).toFixed(0);
        const compressedKB = (compressedFile.size / 1024).toFixed(0);
        
        console.log(`Tamaño original: ${originalKB}KB`);
        console.log(`Tamaño comprimido: ${compressedKB}KB`);
        
        setPaymentData(prev => ({
          ...prev,
          comprobantePago: compressedFile
        }));

        const reader = new FileReader();
        reader.onload = (e) => {
          setPreviewImage(e.target.result);
        };
        reader.readAsDataURL(compressedFile);
        
        toast.dismiss('compress');
        toast.success(`Imagen optimizada: ${originalKB}KB → ${compressedKB}KB`);
        
      } catch (error) {
        toast.dismiss('compress');
        console.error('Error al comprimir imagen:', error);
        toast.error('Error al procesar la imagen');
      }
    } else {
      toast.error('Por favor selecciona una imagen válida');
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const removeImage = () => {
    setPaymentData(prev => ({
      ...prev,
      comprobantePago: null
    }));
    setPreviewImage(null);
  };

  const isFormValid = () => {
    return paymentData.numeroTransferencia.trim() !== '' &&
           paymentData.fechaPago !== '' &&
           paymentData.horaPago !== '' &&
           paymentData.bancoEmisor !== '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormValid()) {
      toast.error('Por favor completa todos los campos obligatorios');
      return;
    }
    onConfirmPayment(paymentData);
  };

  const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const getCurrentTime = () => {
    const now = new Date();
    return now.toTimeString().slice(0, 5);
  };

  return (
    <div className={`${isOpen ? 'block' : 'hidden'} fixed inset-0`} style={{ zIndex: 10000 }}>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50" 
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Modal */}
      <div className="fixed inset-0 overflow-y-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
        <div className="flex min-h-full items-end justify-center p-0 text-center sm:items-center sm:p-4">
          <div className="relative w-full max-w-2xl bg-white shadow-xl ring-1 ring-gray-900/10 rounded-t-3xl sm:rounded-2xl transform transition-all">
            {/* Contenido scrolleable */}
            <div className="max-h-[95vh] overflow-y-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <CreditCardIcon className="h-6 w-6 text-blue-600 mr-2" />
                    <h2 className="text-xl font-semibold text-gray-900">
                      Información de Pago
                    </h2>
                  </div>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600"
                    disabled={isLoading}
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                {/* Resumen del pago */}
                <div className="bg-blue-50 p-4 rounded-lg mb-6">
                  <h3 className="font-medium text-blue-900 mb-2">Monto a Pagar</h3>
                  <p className="text-2xl font-bold text-blue-600">
                    ${totalAmount?.toFixed(2)} USD
                  </p>
                  <p className="text-sm text-blue-700 mt-1">
                    Realiza la transferencia por este monto exacto
                  </p>
                </div>

                {/* Información bancaria */}
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <h3 className="font-medium text-gray-900 mb-3">Datos para Transferencia</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium text-gray-700">Banco:</p>
                      <p className="text-gray-600">Banco Mercantil</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">Número de Cuenta:</p>
                      <p className="text-gray-600">0105-0123-45-1234567890</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">Titular:</p>
                      <p className="text-gray-600">Empresa de Envíos C.A.</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">RIF:</p>
                      <p className="text-gray-600">J-12345678-9</p>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Número de Referencia */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Número de Referencia *
                    </label>
                    <input
                      type="text"
                      required
                      value={paymentData.numeroTransferencia}
                      onChange={(e) => handleInputChange('numeroTransferencia', e.target.value)}
                      placeholder="Ultimos 8 Digitos"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={isLoading}
                    />
                  </div>

                  {/* Fecha y hora del pago */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Fecha del Pago *
                      </label>
                      <input
                        type="date"
                        required
                        max={getCurrentDate()}
                        value={paymentData.fechaPago}
                        onChange={(e) => handleInputChange('fechaPago', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={isLoading}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Hora Estimada *
                      </label>
                      <input
                        type="time"
                        required
                        value={paymentData.horaPago}
                        onChange={(e) => handleInputChange('horaPago', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  {/* Banco emisor */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Banco Emisor *
                    </label>
                    <select
                      required
                      value={paymentData.bancoEmisor}
                      onChange={(e) => handleInputChange('bancoEmisor', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={isLoading}
                    >
                      <option value="">Selecciona tu banco</option>
                      {bancos.map((banco) => (
                        <option key={banco} value={banco}>
                          {banco}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Comprobante de pago */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Comprobante de Pago (Opcional)
                    </label>
                    
                    {!previewImage ? (
                      <div
                        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                          dragActive 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                      >
                        <PhotoIcon className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                        <p className="text-sm text-gray-600 mb-2">
                          Arrastra y suelta una imagen aquí, o
                        </p>
                        <label className="cursor-pointer text-blue-600 hover:text-blue-500 font-medium">
                          selecciona un archivo
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => e.target.files[0] && handleFileUpload(e.target.files[0])}
                            className="hidden"
                            disabled={isLoading}
                          />
                        </label>
                        <p className="text-xs text-gray-500 mt-2">
                          PNG, JPG hasta 5MB
                        </p>
                      </div>
                    ) : (
                      <div className="relative">
                        <img
                          src={previewImage}
                          alt="Comprobante de pago"
                          className="w-full h-48 object-cover rounded-lg border"
                        />
                        <button
                          type="button"
                          onClick={removeImage}
                          className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                          disabled={isLoading}
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                        <p className="text-sm text-gray-600 mt-2">
                          Archivo: {paymentData.comprobantePago?.name}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Nota informativa */}
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      <strong>Importante:</strong> Una vez enviada esta información, nuestro equipo 
                      verificará el pago y se pondrá en contacto con usted para coordinar el envío. 
                      Este proceso puede tomar entre 2-4 horas hábiles.
                    </p>
                  </div>

                  {/* Botones de acción */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-6 mt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={onClose}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                      disabled={isLoading}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      onClick={handleSubmit}
                      disabled={!isFormValid() || isLoading}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {isLoading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Procesando...
                        </>
                      ) : (
                        'Confirmar Información de Pago'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentInfoModal;